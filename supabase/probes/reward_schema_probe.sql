-- ============================================================================
-- REWARD-REVIEW SCHEMA PROBE  —  read-only. Run this FIRST, on staging.
--
-- The reward RPCs live in the mobile app's Supabase project, not in this repo,
-- so the migration that follows (20260713090000_reward_pass_void_claim.sql) has
-- to make exactly two assumptions about the schema. This probe checks both, and
-- prints the one thing the migration cannot guess: which terminal status value
-- `admin_restrict_post` writes to a cancelled claim.
--
-- Nothing here writes. Run it in the Supabase SQL editor and keep the output.
-- ============================================================================

-- 1. Is `status` a native ENUM or TEXT + CHECK?
--    ENUM  → you must run STEP 0 of the migration on its own, first.
--    TEXT  → the migration widens the CHECK for you, automatically.
select
  a.attname                                   as column_name,
  format_type(a.atttypid, a.atttypmod)        as data_type,
  t.typtype                                   as type_kind,   -- 'e' = enum, 'b' = base (text)
  case t.typtype when 'e' then 'ENUM — run STEP 0 separately'
                 else 'TEXT/other — migration handles it' end as verdict
from pg_attribute a
join pg_type t on t.oid = a.atttypid
where a.attrelid = 'public.reward_listing_claims'::regclass
  and a.attname  = 'status'
  and a.attnum > 0 and not a.attisdropped;

-- 2. If it IS an enum, these are its current values (STEP 0 adds to this list).
select e.enumlabel as existing_enum_value, e.enumsortorder
from pg_enum e
join pg_type t on t.oid = e.enumtypid
join pg_attribute a on a.atttypid = t.oid
where a.attrelid = 'public.reward_listing_claims'::regclass
  and a.attname = 'status'
order by e.enumsortorder;

-- 3. If it is TEXT, this is the CHECK the migration will widen (it preserves
--    every literal already in the definition and appends 'approved_unpaid').
select conname, pg_get_constraintdef(oid) as definition
from pg_constraint
where conrelid = 'public.reward_listing_claims'::regclass
  and contype = 'c';

-- 4. THE ONE VALUE THE MIGRATION CANNOT GUESS.
--    `admin_void_claim` must write the SAME terminal status that
--    `admin_restrict_post` already writes when it cancels a claim — otherwise
--    you end up with two words for one outcome. Restrict a throwaway listing on
--    staging, then run this: the non-obvious value in the list is the one to use.
--    If it is NOT 'cancelled', edit VOID_STATUS in the migration before running.
select status, count(*) as rows
from public.reward_listing_claims
group by status
order by rows desc;

-- 5. Sanity: the columns the migration writes. All six are already proven to
--    exist by app/api/admin/reward-history/route.ts, which selects them and
--    works — this is belt-and-braces.
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'reward_listing_claims'
order by ordinal_position;

-- 6. The gate + the coin credit. Copy the admin check and the restricted-post
--    guard from here VERBATIM if they differ from what the migration assumes.
--    CRITICAL for STEP 4 (the cap trigger): confirm the coin credit is an
--    in-transaction SQL write (an INSERT/UPDATE on a ledger or balance table).
--    If it is fired out-of-band — pg_net, an edge function, a queue — a trigger
--    that raises will NOT roll it back, and STEP 4 must be done inside the
--    function instead. STEPS 1-3 are unaffected either way.
select pg_get_functiondef(p.oid) as admin_review_claim_source
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname = 'admin_review_claim';
