'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Modal } from '@/modules/ui/Modal';
import { Button } from '@/modules/ui/Button';
import { whatsappLink } from './promozone.data';

type QuoteSuccessProps = {
  open: boolean;
  rfqNumber: string | null;
  onClose: () => void;
};

export function QuoteSuccess({ open, rfqNumber, onClose }: QuoteSuccessProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Your quote request has been received"
      footer={
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            as="a"
            href={whatsappLink(`Hello, I'd like information about my quote request ${rfqNumber ?? ''}.`)}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            iconLeft={<FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4 text-[var(--success)]" aria-hidden="true" />}
          >
            Message on WhatsApp
          </Button>
          <Button variant="primary" onClick={onClose}>Back to catalog</Button>
        </div>
      }
    >
      <div className="flex flex-col items-center py-4 text-center">
        <span
          className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-success-subtle text-[var(--success)]"
          aria-hidden="true"
        >
          <FontAwesomeIcon icon={faCircleCheck} className="h-8 w-8" />
        </span>
        <p className="text-sm text-text-secondary">
          Your request has been sent to our sales team. We&apos;ll get in touch shortly.
        </p>

        {rfqNumber && (
          <div className="mt-5 w-full rounded-xl border border-border bg-surface-raised p-4">
            <p className="text-xs uppercase tracking-wide text-text-secondary">Your request number</p>
            <p className="mt-1 font-mono text-2xl font-bold tracking-tight text-primary">{rfqNumber}</p>
          </div>
        )}

        <p className="mt-4 text-xs text-text-secondary">
          Keep this number for tracking. Delivery takes 7–10 business days on average after approval.
        </p>
      </div>
    </Modal>
  );
}
