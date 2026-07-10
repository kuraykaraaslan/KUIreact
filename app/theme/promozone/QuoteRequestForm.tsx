'use client';
import { useState } from 'react';
import { Modal } from '@/modules/ui/Modal';
import { Button } from '@/modules/ui/Button';
import { Input } from '@/modules/ui/Input';
import { Textarea } from '@/modules/ui/Textarea';
import { Checkbox } from '@/modules/ui/Checkbox';
import { SectionCard } from '@/modules/app/SectionCard';
import type { QuoteForm } from './promozone.data';

type QuoteRequestFormProps = {
  open: boolean;
  itemCount: number;
  onClose: () => void;
  onSubmit: (form: QuoteForm) => void;
};

type Errors = Partial<Record<keyof QuoteForm, string>>;

const EMPTY: QuoteForm = {
  contactName: '',
  companyName: '',
  email: '',
  phone: '',
  city: '',
  deliveryDate: '',
  description: '',
  consentAccepted: false,
  taxNumber: '',
  website: '',
  altContact: '',
};

const FORM_ID = 'promo-quote-form';

export function QuoteRequestForm({ open, itemCount, onClose, onSubmit }: QuoteRequestFormProps) {
  const [form, setForm] = useState<QuoteForm>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  function set<K extends keyof QuoteForm>(key: K, value: QuoteForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(values: QuoteForm): Errors {
    const e: Errors = {};
    if (!values.companyName.trim()) e.companyName = 'Company name is required.';
    if (!values.contactName.trim()) e.contactName = 'Contact name is required.';
    if (!values.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = 'Enter a valid email.';
    if (!values.phone.trim()) e.phone = 'Phone is required.';
    else if (values.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a valid phone number.';
    if (!values.city.trim()) e.city = 'City is required.';
    if (!values.deliveryDate) e.deliveryDate = 'Delivery date is required.';
    if (!values.description.trim()) e.description = 'Enter a short description.';
    if (!values.consentAccepted) e.consentAccepted = 'Consent is required to continue.';
    return e;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const nextErrors = validate(form);
    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      return;
    }
    onSubmit(form);
    setForm(EMPTY);
    setErrors({});
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Quote request"
      description={`Your company and contact details for ${itemCount} products`}
      scrollable
      className="max-w-2xl"
      footer={
        <div className="flex w-full items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" form={FORM_ID} variant="primary">
            Send quote request
          </Button>
        </div>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-5" noValidate>
        <SectionCard title="Company details">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="q-companyName"
              label="Company name"
              required
              value={form.companyName}
              onChange={(e) => set('companyName', e.target.value)}
              error={errors.companyName}
            />
            <Input
              id="q-contactName"
              label="Contact name"
              required
              value={form.contactName}
              onChange={(e) => set('contactName', e.target.value)}
              error={errors.contactName}
            />
            <Input
              id="q-taxNumber"
              label="Tax number"
              hint="Optional"
              value={form.taxNumber}
              onChange={(e) => set('taxNumber', e.target.value)}
            />
            <Input
              id="q-website"
              label="Company website"
              hint="Optional"
              value={form.website}
              onChange={(e) => set('website', e.target.value)}
            />
          </div>
        </SectionCard>

        <SectionCard title="Contact">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="q-email"
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              error={errors.email}
            />
            <Input
              id="q-phone"
              label="Phone"
              type="tel"
              required
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              error={errors.phone}
            />
            <Input
              id="q-city"
              label="City"
              required
              value={form.city}
              onChange={(e) => set('city', e.target.value)}
              error={errors.city}
            />
            <Input
              id="q-altContact"
              label="Alternative contact"
              hint="Optional (e.g. second phone)"
              value={form.altContact}
              onChange={(e) => set('altContact', e.target.value)}
            />
          </div>
        </SectionCard>

        <SectionCard title="Request details">
          <div className="space-y-4">
            <Input
              id="q-deliveryDate"
              label="Requested delivery date"
              type="date"
              required
              value={form.deliveryDate}
              onChange={(e) => set('deliveryDate', e.target.value)}
              error={errors.deliveryDate}
            />
            <Textarea
              id="q-description"
              label="General description"
              required
              rows={4}
              placeholder="Use case, budget range, special requests…"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              error={errors.description}
            />
            <Checkbox
              id="q-kvkk"
              label="I have read and accept the privacy policy and consent to the processing of my personal data."
              checked={form.consentAccepted}
              onChange={(e) => set('consentAccepted', e.target.checked)}
              error={errors.consentAccepted}
            />
          </div>
        </SectionCard>
      </form>
    </Modal>
  );
}
