'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan, faFileLines, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Drawer } from '@/modules/ui/Drawer';
import { Button } from '@/modules/ui/Button';
import { EmptyState } from '@/modules/ui/EmptyState';
import { formatTRY, type QuoteItem } from './promozone.data';

type QuoteListDrawerProps = {
  open: boolean;
  items: QuoteItem[];
  onClose: () => void;
  onEdit: (item: QuoteItem) => void;
  onRemove: (id: string) => void;
  onProceed: () => void;
};

/** Print summary (color excluded — shown separately with a swatch). */
function printSummary(item: QuoteItem): string {
  if (!item.printed) return 'No print';
  return [item.printTechnique, item.printPosition].filter(Boolean).join(' · ') || 'Printed';
}

export function QuoteListDrawer({ open, items, onClose, onEdit, onRemove, onProceed }: QuoteListDrawerProps) {
  const totalMin = items.reduce((sum, i) => sum + i.quantity * i.snapshot.minimumPrice, 0);
  const totalMax = items.reduce((sum, i) => sum + i.quantity * i.snapshot.maximumPrice, 0);
  const totalUnits = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={`My quote list${items.length ? ` (${items.length})` : ''}`}
      side="right"
      className="w-full sm:w-[30rem]"
      footer={
        items.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Estimated total ({totalUnits} units)</span>
              <span className="font-semibold text-text-primary">
                {formatTRY(totalMin)} – {formatTRY(totalMax)}
              </span>
            </div>
            <Button
              fullWidth
              variant="primary"
              onClick={onProceed}
              iconRight={<FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" aria-hidden="true" />}
            >
              Continue to request
            </Button>
            <p className="text-center text-xs text-text-secondary">
              The exact price is prepared specifically for your request.
            </p>
          </div>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <EmptyState
          icon={<FontAwesomeIcon icon={faFileLines} aria-hidden="true" />}
          title="Your quote list is empty"
          description="Pick a product from the catalog, choose color, print and quantity, and add it to your list."
        />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex gap-3 rounded-lg border border-border bg-surface-base p-3"
            >
              <img
                src={item.snapshot.image}
                alt={item.snapshot.name}
                className="h-16 w-16 shrink-0 rounded-md object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text-primary">{item.snapshot.name}</p>
                    <p className="font-mono text-xs text-text-disabled">{item.snapshot.sku}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      aria-label={`Edit ${item.snapshot.name}`}
                      className={cn(
                        'inline-flex h-7 w-7 items-center justify-center rounded-md text-text-secondary',
                        'transition-colors hover:bg-surface-overlay hover:text-text-primary',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                      )}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      aria-label={`Remove ${item.snapshot.name}`}
                      className={cn(
                        'inline-flex h-7 w-7 items-center justify-center rounded-md text-text-secondary',
                        'transition-colors hover:bg-error-subtle hover:text-error',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                      )}
                    >
                      <FontAwesomeIcon icon={faTrashCan} className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-text-secondary">
                  {item.color && (
                    <span className="inline-flex items-center gap-1">
                      <span
                        className="inline-block h-3 w-3 rounded-full border border-border-strong"
                        style={{ background: item.color.hex }}
                        aria-hidden="true"
                      />
                      {item.color.name}
                    </span>
                  )}
                  {item.color && <span aria-hidden="true">·</span>}
                  <span>{printSummary(item)}</span>
                </div>

                {item.logo && (
                  <div className="mt-1 flex items-center gap-1.5">
                    <img
                      src={item.logo.dataUrl}
                      alt=""
                      className="h-6 w-6 rounded border border-border bg-surface-base object-contain"
                    />
                    <span className="truncate text-xs text-text-secondary">{item.logo.fileName}</span>
                  </div>
                )}
                {item.note && (
                  <p className="mt-0.5 line-clamp-2 text-xs italic text-text-secondary">“{item.note}”</p>
                )}

                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-text-primary">{item.quantity} units</span>
                  <span className="text-xs text-text-secondary">
                    {formatTRY(item.quantity * item.snapshot.minimumPrice)} – {formatTRY(item.quantity * item.snapshot.maximumPrice)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
