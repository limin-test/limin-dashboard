import type { DashboardNavigationItem } from '@/model/dashboard'

export const dashboardNavigationItems: DashboardNavigationItem[] = [
  {
    icon: 'mdi-view-dashboard-outline',
    label: 'Dashboard',
    value: 'dashboard',
  },
  {
    icon: 'mdi-layers-triple-outline',
    label: 'Specification Groups',
    value: 'specification-groups',
  },
  {
    icon: 'mdi-format-list-bulleted-square',
    label: 'Work Order Master',
    value: 'work-order-master',
  },
  {
    icon: 'mdi-clipboard-check-outline',
    label: 'Checklist',
    value: 'checklist',
  },
  {
    icon: 'mdi-ferry',
    label: 'Dry Docks',
    value: 'dry-docks',
  },
]
