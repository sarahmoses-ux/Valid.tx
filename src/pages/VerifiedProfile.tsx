import AppShell from '../components/layout/AppShell'
import ProfileHeader from '../components/profile/ProfileHeader'
import VolumeHeroCard from '../components/profile/VolumeHeroCard'
import ActivityLevelCard from '../components/profile/ActivityLevelCard'
import MetricCard from '../components/profile/MetricCard'
import NetworksUsedCard from '../components/profile/NetworksUsedCard'
import RecentActivityTable from '../components/profile/RecentActivityTable'
import { useActivity } from '../context/ActivityContext'

export default function VerifiedProfile() {
  const { verifiedCount, verifiedVolume } = useActivity()
  return (
    <AppShell
      title="Verified Profile"
      activeNav="profile"
      className="bg-background text-on-background antialiased selection:bg-primary selection:text-on-primary"
      mainClassName="md:ml-64 pt-16 min-h-screen flex flex-col pb-20 md:pb-0"
    >
      <div className="p-4 sm:p-6 lg:p-8 flex-grow max-w-[1440px] mx-auto w-full">
        <ProfileHeader />

        <div className="mb-5 flex items-start gap-3 p-4 rounded-xl border border-secondary/20 bg-secondary/5">
          <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
          <div><p className="text-body-sm font-semibold text-on-surface">Proven facts, not a credit score</p><p className="text-body-sm text-on-surface-variant mt-1">Green-marked activity is cryptographically verified through Attestcoin. Activity level is a transparent summary of volume, count, and consistency.</p></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-gutter">
          <VolumeHeroCard volume={verifiedVolume} />
          <ActivityLevelCard />

          <MetricCard
            label="Verified Transactions"
            value={verifiedCount.toLocaleString()}
            footer={
              <div className="flex items-center gap-xs mt-sm text-secondary font-label-md text-label-md">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                +12% this month
              </div>
            }
          />

          <MetricCard
            label="Unique Counterparties"
            value="86"
            footer={<p className="font-body-sm text-body-sm text-on-surface-variant mt-sm">Across verified transactions only</p>}
          />
          <MetricCard
            label="Active Period"
            value="3Y 2M"
            footer={
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm">First verified tx: Nov 2020</p>
            }
          />
          <MetricCard
            label="Tx Frequency"
            value={
              <>
                12.4 <span className="font-headline-sm text-on-surface-variant">/wk</span>
              </>
            }
            footer={
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm">
                Consistent engagement pattern
              </p>
            }
          />

          <NetworksUsedCard />
          <RecentActivityTable />
        </div>
      </div>
    </AppShell>
  )
}
