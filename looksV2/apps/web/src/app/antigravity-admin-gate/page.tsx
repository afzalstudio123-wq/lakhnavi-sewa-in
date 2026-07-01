'use client';

import React from 'react';
import AdminGate from '@/components/admin/AdminGate';

export default function AdminGatePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-black text-ink tracking-tight">Administrative Console Gateway</h1>
        <p className="text-xs text-muted font-semibold">Strict platform level CRUD override console.</p>
      </div>

      <AdminGate />
    </div>
  );
}
