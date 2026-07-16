import { ShieldCheck } from 'lucide-react';

export default function AuthBrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0c1a12] px-10 py-12 lg:flex xl:px-14">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 20% 80%, rgba(29,158,117,0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 10%, rgba(93,202,165,0.10) 0%, transparent 55%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="relative flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#1D9E75]">
          <ShieldCheck size={19} className="text-white" />
        </div>
        <div>
          <p className="text-[16px] font-medium leading-none text-white">HMS Pro</p>
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.06em] text-[#3B6D11]">Clinical OS</p>
        </div>
      </div>

      <div className="relative flex-1 flex flex-col justify-center py-12">
        <span className="pointer-events-none absolute -top-2 -left-2 select-none text-[96px] font-medium leading-none tracking-[-0.04em] text-white/[0.06]">
          24/7
        </span>

        <div className="mb-5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#5DCAA5]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#1D9E75]" />
          Healthcare reimagined
        </div>

        <h1 className="mb-5 text-[38px] font-medium leading-[1.1] tracking-[-0.025em] text-white">
          One platform.<br />
          <span className="text-[#5DCAA5]">Every patient.</span><br />
          Every workflow.
        </h1>

        <p className="mb-10 max-w-sm text-[13px] leading-[1.75] text-[#5a7a6a]">
          Built for clinicians who move fast. Manage records, billing, staff, and procedures without switching tools.
        </p>

        <div className="grid grid-cols-3 gap-3">
          {[
            { val: '24/7', label: 'Access' },
            { val: 'Secure', label: 'Patient Records' },
            { val: 'Fast', label: 'Workflow' },
          ].map(m => (
            <div key={m.label} className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3.5">
              <p className="text-[22px] font-medium leading-none text-white">{m.val}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.06em] text-[#3B6D11]">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative flex items-center justify-between border-t border-white/[0.06] pt-5">
        <span className="text-[11px] text-[#1f3328]">© {new Date().getFullYear()} HMS Pro</span>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#1D9E75]/25 bg-[#1D9E75]/12 px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#1D9E75]" />
          <span className="text-[11px] font-medium text-[#1D9E75]">All systems live</span>
        </div>
      </div>
    </div>
  );
}