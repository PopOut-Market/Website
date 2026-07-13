-- ============================================================================
-- REWARD REVIEW — the two exits the queue never had.
--
-- WHY
-- ---
-- `admin_review_claim(claim, approve)` fuses two decisions into one: "this
-- listing is fine" (hygiene) AND "+10 coins are owed" (reward). So when a seller
-- hits the 6-listing reward cap, the hygiene decision is taken hostage — the
-- reviewer can no longer say "this listing is fine" without also paying coins
-- that aren't owed. The only remaining exits were:
--
--   * deny  — every reason code asserts seller FAULT, so using one on a clean
--             listing writes a permanent, fabricated accusation; and
--   * restrict — removes a listing that did nothing wrong.
--
-- Both are lies, so an honest reviewer writes nothing, and the claim sits in
-- `pending` forever. That is the "at-cap sellers stack up endlessly" bug, and it
-- is not an edge case: the cap is a LIFETIME count, so every successful seller
-- ends up there permanently.
--
-- WHAT THIS DOES
-- --------------
-- Adds the missing verb — "this listing is fine, and nothing is owed" — as a new
-- function that is STRUCTURALLY INCAPABLE of paying coins, plus a second one for
-- claims whose listing is already down.
--
--   admin_pass_claim(claim)  → status = 'approved_unpaid'.  0 coins. Never pays.
--   admin_void_claim(claim)  → status = <VOID_STATUS>.      0 coins. Never pays.
--
-- WHAT THIS DELIBERATELY DOES *NOT* DO
-- ------------------------------------
-- It never touches `admin_review_claim`. Its body — the coin credit, the seller
-- notification, the admin gate — is not read, not copied, and not replaced. Two
-- reasons:
--
--   1. CREATE OR REPLACE on a money-moving SECURITY DEFINER function whose body
--      you have not read is how you lose money.
--   2. Adding a `p_credit` parameter would create an OVERLOAD, not a change —
--      PostgreSQL function identity is name + argument types. Both candidates
--      would then accept the website's existing 2-arg call via defaults, and
--      PostgREST would answer "Could not choose the best candidate function",
--      BREAKING EVERY APPROVE ON THE SITE.
--
-- It also does NOT record "coins paid" as `status='approved' + coins_awarded=0`.
-- That fails OPEN: every consumer that reads `status='approved'` as "coins were
-- paid" — both service routes in this repo AND every already-shipped mobile
-- binary you cannot grep — would start counting free approvals as rewards, and
-- could show a seller a +10 they never got. A distinct status is invisible to
-- every `status='approved'` filter, so it fails CLOSED, needs no new column, no
-- backfill, and not one line of change to either service route.
--
-- COLUMNS TOUCHED — all six are PROVEN to exist:
--   reward_listing_claims: id, owner_id, post_id, status, decided_at, decided_by
--     (app/api/admin/reward-history/route.ts selects every one of them, and works)
--   reward_admins.user_id  (lib/supabase/admin-server-auth.ts:23)
--   posts.id, posts.status
-- Nothing here writes an internal note, precisely so no column name is guessed.
--
-- DEPLOY ORDER IS NOT A LOADED GUN, AND THAT IS THE POINT:
--   new SQL + old site → the old site has never heard of these functions. No-op.
--   old SQL + new site → the site PROBES for admin_pass_claim at load, finds it
--                        missing, and falls back to a write-nothing local shelf.
-- Either order is safe, and no order can pay a coin that isn't owed.
--
-- RUN THE PROBE FIRST: supabase/probes/reward_schema_probe.sql (read-only).
-- ============================================================================


-- ─── STEP 0 — ONLY IF THE PROBE SAYS `status` IS AN ENUM ─────────────────────
--
-- `ALTER TYPE ... ADD VALUE` cannot run from inside a function or DO block, so
-- it cannot be automated below. If probe query 1 said ENUM, run this ONE line on
-- its own, let it commit, then run the rest of this file. Substitute the real
-- type name from probe query 1. If probe query 1 said TEXT, SKIP THIS ENTIRELY —
-- STEP 1 handles you automatically.
--
--     alter type public.reward_claim_status add value if not exists 'approved_unpaid';
--
-- (An enum value can never be dropped. That is fine — this one is permanent.)


-- ─── STEP 1 — teach `status` the new word (TEXT + CHECK schemas) ─────────────
--
-- Rebuilds the CHECK constraint preserving EVERY literal already in its
-- definition and appending 'approved_unpaid'. It does not invent a vocabulary,
-- so a value you have but I don't know about survives untouched.
do $$
declare
  v_is_enum  boolean;
  v_conname  text;
  v_def      text;
  v_vals     text[];
begin
  select t.typtype = 'e' into v_is_enum
    from pg_attribute a
    join pg_type t on t.oid = a.atttypid
   where a.attrelid = 'public.reward_listing_claims'::regclass
     and a.attname  = 'status'
     and a.attnum > 0 and not a.attisdropped;

  if v_is_enum is null then
    raise exception 'reward_listing_claims.status not found — is the table named differently?';
  end if;

  if v_is_enum then
    -- Verify STEP 0 was actually run, rather than failing later at the first pass.
    if not exists (
      select 1
        from pg_enum e
        join pg_type t on t.oid = e.enumtypid
        join pg_attribute a on a.atttypid = t.oid
       where a.attrelid = 'public.reward_listing_claims'::regclass
         and a.attname = 'status'
         and e.enumlabel = 'approved_unpaid'
    ) then
      raise exception
        'status is an ENUM and does not have the value approved_unpaid yet. Run STEP 0 on its own first (see the comment above), then re-run this file.';
    end if;
    raise notice 'status is an enum and already has approved_unpaid — nothing to widen.';
    return;
  end if;

  select c.conname, pg_get_constraintdef(c.oid)
    into v_conname, v_def
    from pg_constraint c
   where c.conrelid = 'public.reward_listing_claims'::regclass
     and c.contype = 'c'
     and pg_get_constraintdef(c.oid) ilike '%status%'
   limit 1;

  if v_conname is null then
    raise notice 'status is free text with no CHECK constraint — nothing to widen.';
    return;
  end if;

  -- Pull every quoted literal out of the existing definition, then union in ours.
  select array_agg(distinct m[1]) into v_vals
    from regexp_matches(v_def, '''([^'']+)''', 'g') as m;

  if v_vals is null or array_length(v_vals, 1) is null then
    raise exception
      'Could not parse the status CHECK constraint (%). Widen it by hand to include approved_unpaid.', v_def;
  end if;

  select array_agg(distinct x order by x)
    into v_vals
    from unnest(v_vals || array['approved_unpaid']) as x;

  execute format('alter table public.reward_listing_claims drop constraint %I', v_conname);
  execute format(
    'alter table public.reward_listing_claims add constraint %I check (status = any (%L::text[]))',
    v_conname, v_vals
  );

  raise notice 'Widened % to %', v_conname, v_vals;
end $$;


-- ─── STEP 2 — the missing verb: approve, but pay nothing ─────────────────────
--
-- "This listing is fine, and nothing is owed."
--
-- The guard is what makes it safe to put in the reviewer's PRIMARY button slot:
-- it refuses to run for a seller who still has reward slots left. So it can never
-- be used to stiff someone who is genuinely owed +10, and it can never rot into a
-- generic "skip this listing" button. `status='approved'` keeps meaning exactly
-- "coins were paid", which is what every existing reader already assumes.
create or replace function public.admin_pass_claim(p_claim_id bigint)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin uuid := auth.uid();
  v_cap   constant int := 6;   -- MIRRORS REWARD_APPROVED_CAP in lib/supabase/admin-rpc.ts
  v_claim public.reward_listing_claims%rowtype;
  v_paid  int;
begin
  if not exists (select 1 from public.reward_admins ra where ra.user_id = v_admin) then
    raise exception 'NOT_AUTHORIZED';
  end if;

  select * into v_claim
    from public.reward_listing_claims
   where id = p_claim_id
     for update;
  if not found then
    raise exception 'CLAIM_NOT_FOUND';
  end if;

  -- Idempotent. Two reviewers racing the same claim: the loser lands here, reads
  -- the winner's committed row, and gets changed:false — which the site already
  -- renders as "already decided by someone else".
  if v_claim.status <> 'pending' then
    return jsonb_build_object(
      'claim_id', p_claim_id, 'changed', false,
      'status', v_claim.status, 'credited', false, 'coins', 0
    );
  end if;

  -- A pass asserts "this listing is fine and STAYS LIVE" — meaningless if it is
  -- already down. Those claims are admin_void_claim's job.
  if exists (
    select 1 from public.posts p
     where p.id = v_claim.post_id and p.status = 'restricted'
  ) then
    raise exception 'REWARDS_POST_RESTRICTED';
  end if;

  -- *** THE GUARD ***  Pass is ONLY for sellers who are owed nothing.
  select count(*) into v_paid
    from public.reward_listing_claims
   where owner_id = v_claim.owner_id
     and status = 'approved';           -- 'approved' == coins were actually paid
  if v_paid < v_cap then
    raise exception 'SELLER_UNDER_CAP';  -- the reviewer must Approve and pay
  end if;

  update public.reward_listing_claims
     set status      = 'approved_unpaid',
         decided_at  = now(),
         decided_by  = v_admin
   where id = p_claim_id;

  -- No ledger row. No balance change. No notification: the listing is live,
  -- nothing was owed, and nothing was promised — silence is the truthful message.
  return jsonb_build_object(
    'claim_id', p_claim_id, 'changed', true, 'status', 'approved_unpaid',
    'credited', false, 'coins', 0,
    'owner_id', v_claim.owner_id, 'approved_count', v_paid, 'cap', v_cap, 'at_cap', true
  );
end $$;

revoke all on function public.admin_pass_claim(bigint) from public, anon;
grant execute on function public.admin_pass_claim(bigint) to authenticated;


-- ─── STEP 3 — the exit for claims whose listing is already down ──────────────
--
-- A pending claim on a restricted listing has NO exit today: approve and deny
-- both raise REWARDS_POST_RESTRICTED, and re-restricting is a no-op. So it is a
-- second, invisible way for the queue to stack forever.
--
-- CHECK THE PROBE: if `admin_restrict_post` cancels claims with a status other
-- than 'cancelled', change VOID_STATUS below to match it. Two words for one
-- outcome is worse than either word.
create or replace function public.admin_void_claim(p_claim_id bigint)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_claim       public.reward_listing_claims%rowtype;
  v_post_status text;
  VOID_STATUS   constant text := 'cancelled';   -- ← confirm against probe query 4
begin
  if not exists (select 1 from public.reward_admins ra where ra.user_id = auth.uid()) then
    raise exception 'NOT_AUTHORIZED';
  end if;

  select * into v_claim
    from public.reward_listing_claims
   where id = p_claim_id
     for update;
  if not found then
    raise exception 'CLAIM_NOT_FOUND';
  end if;

  if v_claim.status <> 'pending' then
    return jsonb_build_object('claim_id', p_claim_id, 'changed', false, 'status', v_claim.status);
  end if;

  select p.status into v_post_status from public.posts p where p.id = v_claim.post_id;

  -- *** THE GUARD ***  Void is ONLY for claims whose listing is RESTRICTED — the
  -- one state in which no honest reward decision is possible (approve and deny
  -- both raise REWARDS_POST_RESTRICTED). Allow-list, not deny-list: a SOLD listing
  -- must still be approvable (a fast sale is a GOOD outcome and the +10 is owed),
  -- and voiding it would quietly rob the seller. This also makes the function
  -- structurally incapable of becoming a "skip the hygiene check" backdoor.
  if coalesce(v_post_status, '') <> 'restricted' then
    raise exception 'POST_STILL_LIVE';
  end if;

  update public.reward_listing_claims
     set status     = VOID_STATUS,
         decided_at = now(),
         decided_by = auth.uid()
   where id = p_claim_id;

  return jsonb_build_object('claim_id', p_claim_id, 'changed', true, 'status', VOID_STATUS);
end $$;

revoke all on function public.admin_void_claim(bigint) from public, anon;
grant execute on function public.admin_void_claim(bigint) to authenticated;


-- ─── STEP 4 — OPTIONAL: make the cap a real database rule ────────────────────
--
-- Today the 6-cap is enforced by DISABLING A BUTTON IN A BROWSER. That is not a
-- cap. Two reviewers who both loaded the page while a seller was at 5/6 will both
-- see an enabled Approve, and `admin_review_claim` will happily pay a 7th +10 —
-- and coins redeem for real AUD gift cards (reward_voucher_products.coin_cost →
-- value_cents). The website now fails closed in a few more places, but only the
-- database can actually guarantee this.
--
-- The trigger fires INSIDE admin_review_claim's transaction, so a 7th payment
-- rolls the whole thing back — including the coin credit — WITHOUT ever touching
-- that function's body. The advisory lock is the load-bearing part: it serialises
-- payments per SELLER, which is the only thing that closes "two reviewers, two
-- DIFFERENT claims, same seller at 5/6". A row lock provably cannot — the two
-- transactions never contend on a shared row.
--
-- It also closes the deleted-profile bypass for free: it counts `owner_id` off
-- the CLAIM row, which survives the profile being deleted.
--
-- ⚠ ONE PRECONDITION, from probe query 6: this only works if the coin credit is
-- an in-transaction SQL write. If it is fired out-of-band (pg_net, an edge
-- function, a queue), the rollback will not reach it and the cap must be enforced
-- inside admin_review_claim instead. STEPS 1-3 do not care either way — do not
-- let this step block them.
--
-- Uncomment to install.
--
-- create or replace function public.enforce_reward_cap()
-- returns trigger
-- language plpgsql
-- security definer
-- set search_path = public
-- as $$
-- declare
--   v_paid int;
--   v_cap  constant int := 6;
-- begin
--   -- `is distinct from` rather than coalesce(old.status,'') — the latter compares
--   -- the column against an untyped '' and blows up on an ENUM status column
--   -- ("invalid input value for enum"), which would brick EVERY approve. This form
--   -- is null-safe AND type-safe on both the enum and text schemas.
--   if new.status = 'approved' and old.status is distinct from 'approved' then
--     perform pg_advisory_xact_lock(hashtextextended('reward_cap:' || new.owner_id::text, 0));
--     select count(*) into v_paid
--       from public.reward_listing_claims
--      where owner_id = new.owner_id
--        and status = 'approved'
--        and id <> new.id;
--     if v_paid >= v_cap then
--       raise exception 'REWARD_CAP_EXCEEDED';
--     end if;
--   end if;
--   return new;
-- end $$;
--
-- drop trigger if exists reward_cap_guard on public.reward_listing_claims;
-- create trigger reward_cap_guard
--   before update on public.reward_listing_claims
--   for each row execute function public.enforce_reward_cap();


-- ─── VERIFY ─────────────────────────────────────────────────────────────────
-- select proname, pg_get_function_identity_arguments(oid)
--   from pg_proc
--  where proname in ('admin_pass_claim','admin_void_claim');
--
-- Then reload /admin-super/dashboard/reward-review. The page probes for
-- admin_pass_claim on load: the grey "no-coins approve isn't installed" banner
-- disappears on its own, and every at-cap card's primary button changes from
-- "⏸ Set aside" to "✓ Approve · no coins". No redeploy.
