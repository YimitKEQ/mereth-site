"use client";

import { useMemo, useState } from "react";

import { OrnateBox } from "@/components/ornament/OrnateBox";
import { OrnateFrame } from "@/components/ornament/OrnateFrame";
import { ArtPlaceholder } from "@/components/ui/ArtPlaceholder";
import { Badge, Checkbox, Modal, SearchField, Tabs } from "@/components/ui/Controls";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Bag, Calendar, Coins, Sparkle } from "@/components/ui/icons";
import {
  categoryLabels,
  characters,
  inventory as seedInventory,
  shopItems,
  walletBalance,
  type ClaimStatus,
  type InventoryEntry,
  type ItemCategory,
} from "@/lib/shop";

type StatusFilter = "all" | ClaimStatus;
type CategoryFilter = "all" | ItemCategory;
type Sort = "newest" | "oldest" | "name";

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "claimed", label: "Claimed" },
  { id: "unclaimed", label: "Unclaimed" },
  { id: "expired", label: "Expired" },
];

const STATUS_TONE = {
  claimed: "success",
  unclaimed: "accent",
  expired: "muted",
} as const;

/**
 * The signed-in account view: a shop and the things bought from it.
 *
 * All state is local, because there is no backend yet. It is real state though:
 * filters compose, search narrows within them, claiming moves an entry between
 * buckets and the counts follow. A prototype that only looks right teaches
 * nothing about whether the interaction is right.
 */
export function AccountPanel() {
  const [tab, setTab] = useState("inventory");
  const [entries, setEntries] = useState<InventoryEntry[]>([...seedInventory]);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const [hideOwned, setHideOwned] = useState(false);
  const [sort, setSort] = useState<Sort>("newest");
  const [deliverTo, setDeliverTo] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const owned = useMemo(() => new Set(entries.map((entry) => entry.itemId)), [entries]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = entries.filter((entry) => {
      if (status !== "all" && entry.status !== status) return false;
      if (category !== "all" && entry.category !== category) return false;
      if (needle && !entry.name.toLowerCase().includes(needle)) return false;
      return true;
    });
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "oldest") list.reverse();
    return list;
  }, [entries, status, category, query, sort]);

  const visibleShop = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return shopItems.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (hideOwned && owned.has(item.id)) return false;
      if (needle && !item.name.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [category, hideOwned, query, owned]);

  const claimable = visible.filter((entry) => entry.status === "unclaimed").map((entry) => entry.id);
  const chosen = selected.filter((id) => claimable.includes(id));

  function toggle(id: string): void {
    setSelected((previous) =>
      previous.includes(id) ? previous.filter((value) => value !== id) : [...previous, id],
    );
  }

  function claim(ids: string[]): void {
    setEntries((previous) =>
      previous.map((entry) =>
        ids.includes(entry.id) && entry.status === "unclaimed"
          ? { ...entry, status: "claimed", claimedBy: deliverTo }
          : entry,
      ),
    );
    setSelected([]);
    setConfirming(false);
    setNotice(`${ids.length} ${ids.length === 1 ? "item" : "items"} delivered to ${deliverTo}.`);
  }

  function requestClaim(ids: string[]): void {
    if (!deliverTo) {
      setNotice("Choose a character to deliver to first.");
      return;
    }
    setSelected(ids);
    setConfirming(true);
  }

  return (
    <OrnateFrame weight="heavy" contentClassName="p-5 md:p-8">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs
          tabs={[
            { id: "shop", label: "Shop", icon: <Bag /> },
            { id: "inventory", label: "Inventory", icon: <Sparkle /> },
          ]}
          active={tab}
          onChange={setTab}
        />
        <div className="flex flex-wrap items-center gap-3">
          <OrnateBox size="sm">
            <span className="flex h-11 items-center gap-2 px-4 text-sm text-brand-accent">
              <Coins />
              <span className="tabular-nums">{walletBalance.toLocaleString("en-US")}</span>
              <span className="text-text-muted">Jade Coins</span>
            </span>
          </OrnateBox>
          <Button variant="solid" size="md" onClick={() => setNotice("The store is not open yet.")}>
            Buy Jade Coins
          </Button>
        </div>
      </div>

      {/* Delivery row, inventory only */}
      {tab === "inventory" ? (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <label htmlFor="deliver-to" className="text-sm text-text-muted">
            Deliver to:
          </label>
          <Select
            id="deliver-to"
            label="Select a character"
            options={characters}
            value={deliverTo}
            onChange={(event) => setDeliverTo(event.target.value)}
            className="w-[260px]"
          />
          <Button
            variant="solid"
            size="md"
            disabled={claimable.length === 0}
            onClick={() => requestClaim(claimable)}
          >
            Claim selected
          </Button>
        </div>
      ) : null}

      {/* Filter row */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <SearchField
          label="Search items"
          placeholder="Search items…"
          value={query}
          onChange={setQuery}
          className="w-full max-w-md"
        />
        {tab === "shop" ? (
          <Checkbox label="Hide owned" checked={hideOwned} onChange={setHideOwned} />
        ) : null}
        <Select
          label="Sort"
          options={["Newest", "Oldest", "Name"]}
          value={sort === "newest" ? "Newest" : sort === "oldest" ? "Oldest" : "Name"}
          onChange={(event) => {
            const value = event.target.value.toLowerCase();
            setSort(value === "oldest" ? "oldest" : value === "name" ? "name" : "newest");
          }}
          className="ml-auto w-[160px]"
        />
      </div>

      {notice ? (
        <p
          role="status"
          className="mt-4 border-l-2 border-brand-accent bg-brand-accent/10 px-4 py-3 text-sm text-brand-accent"
        >
          {notice}
        </p>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="flex flex-col gap-5">
          {tab === "inventory" ? (
            <OrnateBox size="sm" contentClassName="p-4">
              <h3 className="font-display px-2 text-xs tracking-heading text-brand-accent">Status</h3>
              <ul className="mt-3 flex flex-col gap-1">
                {STATUS_FILTERS.map((filter) => (
                  <li key={filter.id}>
                    <button
                      type="button"
                      aria-pressed={status === filter.id}
                      onClick={() => setStatus(filter.id)}
                      className={`w-full rounded-sm px-2 py-2 text-left text-sm transition-colors ${
                        status === filter.id
                          ? "bg-brand-accent/15 text-brand-accent"
                          : "text-text-muted hover:bg-white/5 hover:text-text-primary"
                      }`}
                    >
                      {filter.label}
                    </button>
                  </li>
                ))}
              </ul>
            </OrnateBox>
          ) : null}

          <OrnateBox size="sm" contentClassName="p-4">
            <h3 className="font-display px-2 text-xs tracking-heading text-brand-accent">Categories</h3>
            <ul className="mt-3 flex flex-col gap-1">
              {([["all", "All Products"], ...Object.entries(categoryLabels)] as [CategoryFilter, string][]).map(
                ([id, label]) => (
                  <li key={id}>
                    <button
                      type="button"
                      aria-pressed={category === id}
                      onClick={() => setCategory(id)}
                      className={`w-full rounded-sm px-2 py-2 text-left text-sm transition-colors ${
                        category === id
                          ? "bg-brand-accent/15 text-brand-accent"
                          : "text-text-muted hover:bg-white/5 hover:text-text-primary"
                      }`}
                    >
                      {label}
                    </button>
                  </li>
                ),
              )}
            </ul>
          </OrnateBox>
        </aside>

        {/* Rows */}
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-muted" aria-live="polite">
            {tab === "inventory" ? visible.length : visibleShop.length} items
          </p>

          {tab === "inventory"
            ? visible.map((entry) => {
                const isSelected = chosen.includes(entry.id);
                return (
                  <OrnateBox
                    key={entry.id}
                    size="sm"
                    className={isSelected ? "brightness-125" : ""}
                    contentClassName="flex flex-wrap items-center gap-4 p-4"
                  >
                    <ArtPlaceholder
                      seed={entry.itemId}
                      label={entry.name}
                      className="h-16 w-24 shrink-0 border border-brand-accent/50"
                    />
                    <div className="min-w-[180px] flex-1">
                      <h3 className="font-display text-sm tracking-heading text-brand-accent">
                        {entry.name}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge tone="neutral">{categoryLabels[entry.category]}</Badge>
                        <Badge tone={STATUS_TONE[entry.status]}>
                          {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="mt-2 flex items-center gap-2 text-xs text-text-muted">
                        <Calendar />
                        Purchased {entry.purchasedAt}
                        {entry.claimedBy ? ` · claimed to ${entry.claimedBy}` : ""}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {entry.status === "unclaimed" ? (
                        <>
                          <Button size="sm" onClick={() => requestClaim([entry.id])}>
                            Claim
                          </Button>
                          <Checkbox
                            label="Select"
                            checked={isSelected}
                            onChange={() => toggle(entry.id)}
                          />
                        </>
                      ) : (
                        <Button size="sm" onClick={() => setNotice(`${entry.name}: no further detail yet.`)}>
                          Details
                        </Button>
                      )}
                    </div>
                  </OrnateBox>
                );
              })
            : visibleShop.map((item) => (
                <OrnateBox
                  key={item.id}
                  size="sm"
                  contentClassName="flex flex-wrap items-center gap-4 p-4"
                >
                  <ArtPlaceholder
                    seed={item.id}
                    label={item.name}
                    className="h-16 w-24 shrink-0 border border-brand-accent/50"
                  />
                  <div className="min-w-[180px] flex-1">
                    <h3 className="font-display text-sm tracking-heading text-brand-accent">
                      {item.name}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge tone="neutral">{categoryLabels[item.category]}</Badge>
                      {owned.has(item.id) ? <Badge tone="success">Owned</Badge> : null}
                    </div>
                    <p className="mt-2 text-xs text-text-muted">{item.blurb}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-sm text-brand-accent tabular-nums">
                      <Coins />
                      {item.price.toLocaleString("en-US")}
                    </span>
                    <Button size="sm" onClick={() => setNotice("The store is not open yet.")}>
                      Buy
                    </Button>
                  </div>
                </OrnateBox>
              ))}

          {(tab === "inventory" ? visible.length : visibleShop.length) === 0 ? (
            <OrnateBox size="sm" contentClassName="p-12 text-center">
              <p className="font-display text-lg tracking-heading text-brand-accent">Nothing here</p>
              <p className="mx-auto mt-3 max-w-sm text-sm text-text-muted">
                No items match these filters. Clear the search or pick a different category.
              </p>
            </OrnateBox>
          ) : null}
        </div>
      </div>

      <Modal
        open={confirming}
        title="Confirm delivery"
        onClose={() => setConfirming(false)}
        footer={
          <>
            <Button size="md" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
            <Button variant="solid" size="md" onClick={() => claim(selected)}>
              Deliver
            </Button>
          </>
        }
      >
        Deliver {selected.length} {selected.length === 1 ? "item" : "items"} to{" "}
        <strong className="text-brand-accent">{deliverTo}</strong>? Delivery cannot be undone, and
        the items will appear in that character&apos;s mailbox.
      </Modal>
    </OrnateFrame>
  );
}
