# BulkActionTable

- **id:** `bulk-action-table`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/BulkActionTable.tsx`
- **status:** stable
- **since:** 2026-08

Table with **id-keyed** row selection and a bulk-action bar. `DataTable`’s own `selectable` prop keys selection by array index and only works in the deprecated legacy view, so selections there follow the wrong rows once anything sorts or paginates.

## Variants

### Selection and actions

```tsx
<BulkActionTable
  rows={companies}
  rowId={(c) => c.companyId}
  selected={selected}
  onSelectedChange={setSelected}
  columns={columns}
  actions={[{ key: 'enrich', label: 'Enrich', onAction: enrich }]}
/>
```

### Unselectable rows, and select-all-matching

```tsx
<BulkActionTable
  isRowSelectable={(c) => (c.suppressed ? 'Suppressed' : true)}
  totalMatching={total}
  onSelectAllMatching={selectEverything}
  …
/>
```

## Full source

```tsx
'use client';
// Id-keyed row selection plus a bulk-action bar. Selection survives sort,
// filter and pagination because it is keyed on the row's own id, never on its
// position in the array.
export function BulkActionTable({ columns, rows, rowId, selected, onSelectedChange, actions = [], isRowSelectable, totalMatching, onSelectAllMatching }) {
  const selectedSet = new Set(selected);
  const selectableRows = rows.filter((r) => (isRowSelectable ? isRowSelectable(r) === true : true));
  const allVisibleSelected = selectableRows.length > 0 && selectableRows.every((r) => selectedSet.has(rowId(r)));

  function toggleAllVisible() {
    const next = new Set(selectedSet);
    // Deselect only what is visible: a selection made on page 1 must survive
    // clearing page 2.
    for (const row of selectableRows) allVisibleSelected ? next.delete(rowId(row)) : next.add(rowId(row));
    onSelectedChange([...next]);
  }

  // `indeterminate` is a DOM property, not an attribute — without the ref a
  // partial selection looks identical to none.
  const headerCheckbox = (
    <input type="checkbox" checked={allVisibleSelected}
      ref={(el) => { if (el) el.indeterminate = !allVisibleSelected && selectableRows.some((r) => selectedSet.has(rowId(r))); }}
      onChange={toggleAllVisible} aria-label="Select all rows on this page" />
  );

  return (
    <div>
      {selected.length > 0 && (
        <div role="region" aria-label="Bulk actions">
          <span>{selected.length} selected</span>
          {totalMatching > rows.length && (
            <button onClick={onSelectAllMatching}>Select all {totalMatching} matching</button>
          )}
          {actions.map((a) => <button key={a.key} onClick={() => a.onAction([...selected])}>{a.label}</button>)}
        </div>
      )}
      <Table columns={[{ key: '__selection', header: headerCheckbox, render: rowCheckbox }, ...columns]} rows={rows} />
    </div>
  );
}
```
