import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { permissionGuard } from './core/permission.guard';
import { Permissions } from './core/permissions';
import { LandingPageComponent } from './pages/landing.page';
import { LoginPageComponent } from './pages/login.page';
import { ClientLayoutComponent } from './layouts/client-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout.component';
import { ClientDashboardPageComponent } from './pages/client/client-dashboard.page';
import { AccountsPageComponent } from './pages/client/accounts.page';
import { TransfersPageComponent } from './pages/client/transfers.page';
import { CardsPageComponent } from './pages/client/cards.page';
import { NotificationsPageComponent } from './pages/client/notifications.page';
import { ProfilePageComponent } from './pages/client/profile.page';
import { AnalyticsPageComponent } from './pages/client/analytics.page';
import { AdminDashboardPageComponent } from './pages/admin/admin-dashboard.page';
import { UserManagementPageComponent } from './pages/admin/user-management.page';
import { AccountManagementPageComponent } from './pages/admin/account-management.page';
import { CardManagementPageComponent } from './pages/admin/card-management.page';
import { TransactionMonitoringPageComponent } from './pages/admin/transaction-monitoring.page';
import { FraudManagementPageComponent } from './pages/admin/fraud-management.page';
import { RbacManagementPageComponent } from './pages/admin/rbac-management.page';
import { AuditLogsPageComponent } from './pages/admin/audit-logs.page';

export const routes: Routes = [
	{ path: '', component: LandingPageComponent },
	{ path: 'login', component: LoginPageComponent },
	{
		path: 'app',
		component: ClientLayoutComponent,
		canActivate: [authGuard],
		children: [
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
			{
				path: 'dashboard',
				component: ClientDashboardPageComponent,
				canActivate: [permissionGuard],
				data: { permissions: [Permissions.clientDashboardView] }
			},
			{
				path: 'accounts',
				component: AccountsPageComponent,
				canActivate: [permissionGuard],
				data: { permissions: [Permissions.clientAccountsView] }
			},
			{
				path: 'transfers',
				component: TransfersPageComponent,
				canActivate: [permissionGuard],
				data: { permissions: [Permissions.clientTransfersCreate] }
			},
			{
				path: 'cards',
				component: CardsPageComponent,
				canActivate: [permissionGuard],
				data: { permissions: [Permissions.clientCardsManage] }
			},
			{
				path: 'notifications',
				component: NotificationsPageComponent,
				canActivate: [permissionGuard],
				data: { permissions: [Permissions.clientNotificationsView] }
			},
			{
				path: 'profile',
				component: ProfilePageComponent,
				canActivate: [permissionGuard],
				data: { permissions: [Permissions.clientProfileManage] }
			},
			{
				path: 'analytics',
				component: AnalyticsPageComponent,
				canActivate: [permissionGuard],
				data: { permissions: [Permissions.clientAnalyticsView] }
			}
		]
	},
	{ path: 'dashboard', redirectTo: 'app/dashboard', pathMatch: 'full' },
	{ path: 'accounts', redirectTo: 'app/accounts', pathMatch: 'full' },
	{ path: 'transfers', redirectTo: 'app/transfers', pathMatch: 'full' },
	{ path: 'cards', redirectTo: 'app/cards', pathMatch: 'full' },
	{ path: 'notifications', redirectTo: 'app/notifications', pathMatch: 'full' },
	{ path: 'analytics', redirectTo: 'app/analytics', pathMatch: 'full' },
	{ path: 'profile', redirectTo: 'app/profile', pathMatch: 'full' },
	{
		path: 'admin',
		component: AdminLayoutComponent,
		canActivate: [authGuard],
		children: [
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
			{
				path: 'dashboard',
				component: AdminDashboardPageComponent,
				canActivate: [permissionGuard],
				data: { permissions: [Permissions.adminKpiView] }
			},
			{
				path: 'users',
				component: UserManagementPageComponent,
				canActivate: [permissionGuard],
				data: { permissions: [Permissions.adminUsersManage] }
			},
			{
				path: 'accounts',
				component: AccountManagementPageComponent,
				canActivate: [permissionGuard],
				data: { permissions: [Permissions.backofficeAccountsManage] }
			},
			{
				path: 'cards',
				component: CardManagementPageComponent,
				canActivate: [permissionGuard],
				data: { permissions: [Permissions.backofficeCardsManage] }
			},
			{
				path: 'transactions',
				component: TransactionMonitoringPageComponent,
				canActivate: [permissionGuard],
				data: { permissions: [Permissions.backofficeTransactionsMonitor] }
			},
			{
				path: 'fraud',
				component: FraudManagementPageComponent,
				canActivate: [permissionGuard],
				data: { permissions: [Permissions.backofficeFraudManage] }
			},
			{
				path: 'rbac',
				component: RbacManagementPageComponent,
				canActivate: [permissionGuard],
				data: { permissions: [Permissions.adminRolesManage] }
			},
			{
				path: 'audit',
				component: AuditLogsPageComponent,
				canActivate: [permissionGuard],
				data: { permissions: [Permissions.adminAuditView] }
			}
		]
	},
	{ path: '**', redirectTo: '' }
];
