import { CircleCheck, BadgePlus, FilePlus2, UserCog } from "lucide-react";

const iconMap = {
  student: BadgePlus,
  fee: CircleCheck,
  exam: FilePlus2,
  teacher: UserCog,
};

export default function RecentActivity({ activities }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Recent Activity</h3>
      <ul className="space-y-3">
        {activities.map((item) => {
          const Icon = iconMap[item.type] || CircleCheck;
          return (
            <li key={item.id} className="flex items-start gap-3 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/70">
              <div className="mt-0.5 rounded-lg bg-white p-2 text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
                <Icon size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{item.title}</p>
                <p className="text-xs text-slate-500">{item.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}