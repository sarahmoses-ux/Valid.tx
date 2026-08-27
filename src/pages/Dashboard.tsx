import AppShell from '../components/layout/AppShell'
import StatsGrid from '../components/dashboard/StatsGrid'
import VolumeChart from '../components/dashboard/VolumeChart'
import ActivityDonut from '../components/dashboard/ActivityDonut'
import NetworksTable from '../components/dashboard/NetworksTable'
import ActivityInsights from '../components/dashboard/ActivityInsights'

export default function Dashboard() {
  return (
    <AppShell
      title="Dashboard"
      activeNav="overview"
      className="dashboard-bg text-on-surface font-body-md text-body-md antialiased overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container"
    >
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-label-md uppercase tracking-widest text-primary mb-2">Wallet activity</p>
          <h2 className="font-headline-lg text-headline-lg font-semibold text-on-surface">Verified Activity Overview</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">Discovered activity is indexed from source chains. Verified activity is backed by an Attestcoin proof.</p>
        </div>
        <div className="inline-flex self-start items-center gap-2 px-3 py-2 rounded-lg border border-secondary/30 bg-secondary/10 text-secondary text-label-md uppercase tracking-wider whitespace-nowrap">
          <span className="material-symbols-outlined text-[18px]">verified</span>Attestcoin Verified
        </div>
      </div>

      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8 items-stretch">
        <VolumeChart />
        <ActivityDonut />
      </div>

      <ActivityInsights />

      <NetworksTable />
    </AppShell>
  )
}
