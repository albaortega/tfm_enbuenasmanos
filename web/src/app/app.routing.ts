import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/services/auth/auth.guard';

export const rootRouterConfig: Routes = [
    {
        path: '',
        redirectTo: 'dashboard/home',
        pathMatch: 'full'
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'sessions',
                loadChildren: () => import('./views/sessions/sessions.module').then(m => m.SessionsModule),
                data: { title: 'Session'}
            }
        ]
    },
    {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'home',
                loadChildren: () => import('./views/home/home.module').then(m => m.HomeModule),
                data: { title: 'Nuevo Servicio' }
            },
            {
                path: 'historial',
                loadChildren: () => import('./views/historial/historial.module').then(m => m.HistorialModule),
                data: {title: 'Historial'}
            },
            {
                path: 'workersolicitudes',
                loadChildren: () => import('./views/worker-solicitudes/solicitudes.module').then(m => m.SolicitudesModule),
                data: {title: 'Solicitudes'}
            },
            {
                path: 'workerhistorial',
                loadChildren: () => import('./views/worker-historial/historial.module').then(m => m.HistorialModule),
                data: {title: 'Historial'}
            },
            {
                path: 'servicedetails',
                loadChildren: () => import('./views/service-details/service-details.module').then(m => m.ServiceDetailsModule),
                data: {title: 'Detalles'}
            },
            {
                path: 'newworker',
                loadChildren: () => import('./views/new-worker/new-worker.module').then(m => m.NewWorkerModule),
                data: {title: 'Nuevo trabajador'}
            },
            {
                path: 'adminhistorial',
                loadChildren: () => import('./views/admin-historial/historial.module').then(m => m.HistorialModule),
                data: {title: 'Historial'}
            },
            {
                path: 'adminsolicitudes',
                loadChildren: () => import('./views/admin-solicitudes/solicitudes.module').then(m => m.SolicitudesModule),
                data: {title: 'Solicitudes'}
            },
            {
                path: 'confworkers',
                loadChildren: () => import('./views/conf-workers/conf-workers.module').then(m => m.ConfWorkersModule),
                data: {title: 'Solicitudes'}
            },
            {
                path: 'confworkersinactive',
                loadChildren: () => import('./views/conf-workers-inactive/conf-workers-inactive.module').then(m => m.ConfWorkersInactiveModule),
                data: {title: 'Solicitudes'}
            },
            {
                path: 'incorporationdate',
                loadChildren: () => import('./views/incorporation-date/incorporation-date.module').then(m => m.IncorporationDateModule),
                data: {title: 'Solicitudes'}
            },
            {
                path: 'workerdetails',
                loadChildren: () => import('./views/worker-details/worker-details.module').then(m => m.WorkerDetailsModule),
                data: {title: 'Solicitudes'}
            },
            {
                path: 'newaddress',
                loadChildren: () => import('./views/new-address/new-address.module').then(m => m.NewAddressModule),
                data: {title: 'Nueva dirección'}
            },
            {
                path: 'assignservice',
                loadChildren: () => import('./views/assign-service/assign-service.module').then(m => m.AssignServiceModule),
                data: {title: 'Asignar'}
            },
            {
                path: 'prices',
                loadChildren: () => import('./views/prices/prices.module').then(m => m.PricesModule),
                data: {title: 'Precios'}
            },
            {
                path: 'chatuser',
                loadChildren: () => import('./views/tracing/app-chats.module').then(m => m.AppChatsModule),
                data: { title: 'Chat'}
            },
            {
                path: 'askforinfo',
                loadChildren: () => import('./views/ask-for-info/ask-for-info.module').then(m => m.AskForInfoModule),
                data: { title: 'Info'}
            },

            {
                path: 'dashboard',
                loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule),
                data: { title: 'Dashboard', breadcrumb: 'DASHBOARD'}
            },
            {
                path: 'material',
                loadChildren: () => import('./views/material-example-view/material-example-view.module').then(m => m.MaterialExampleViewModule),
                data: { title: 'Material', breadcrumb: 'MATERIAL'}
            },
            {
                path: 'dialogs',
                loadChildren: () => import('./views/app-dialogs/app-dialogs.module').then(m => m.AppDialogsModule),
                data: { title: 'Dialogs', breadcrumb: 'DIALOGS'}
            },
            {
                path: 'profile',
                loadChildren: () => import('./views/profile/profile.module').then(m => m.ProfileModule),
                data: { title: 'Profile'}
            },
            {
                path: 'others',
                loadChildren: () => import('./views/others/others.module').then(m => m.OthersModule),
                data: { title: 'Others', breadcrumb: 'OTHERS'}
            },
            {
                path: 'tables',
                loadChildren: () => import('./views/tables/tables.module').then(m => m.TablesModule),
                data: { title: 'Tables', breadcrumb: 'TABLES'}
            },
            {
                path: 'tour',
                loadChildren: () => import('./views/app-tour/app-tour.module').then(m => m.AppTourModule),
                data: { title: 'Tour', breadcrumb: 'TOUR'}
            },
            {
                path: 'forms',
                loadChildren: () => import('./views/forms/forms.module').then(m => m.AppFormsModule),
                data: { title: 'Forms', breadcrumb: 'FORMS'}
            },
            {
                path: 'chart',
                loadChildren: () => import('./views/chart-example-view/chart-example-view.module').then(m => m.ChartExampleViewModule),
                data: { title: 'Charts', breadcrumb: 'CHARTS'}
            },
            {
                path: 'charts',
                loadChildren: () => import('./views/charts/charts.module').then(m => m.AppChartsModule),
                data: { title: 'Charts', breadcrumb: 'CHARTS'}
            },
            {
                path: 'map',
                loadChildren: () => import('./views/map/map.module').then(m => m.AppMapModule),
                data: { title: 'Map', breadcrumb: 'MAP'}
            },
            {
                path: 'dragndrop',
                loadChildren: () => import('./views/dragndrop/dragndrop.module').then(m => m.DragndropModule),
                data: { title: 'Drag and Drop', breadcrumb: 'DND'}
            },
            {
                path: 'inbox',
                loadChildren: () => import('./views/app-inbox/app-inbox.module').then(m => m.AppInboxModule),
                data: { title: 'Inbox', breadcrumb: 'INBOX'}
            },
            {
                path: 'calendar',
                loadChildren: () => import('./views/app-calendar/app-calendar.module').then(m => m.AppCalendarModule),
                data: { title: 'Calendar', breadcrumb: 'CALENDAR'}
            },
            {
                path: 'chat',
                loadChildren: () => import('./views/app-chats/app-chats.module').then(m => m.AppChatsModule),
                data: { title: 'Chat', breadcrumb: 'CHAT'}
            },
            {
                path: 'cruds',
                loadChildren: () => import('./views/cruds/cruds.module').then(m => m.CrudsModule),
                data: { title: 'CRUDs', breadcrumb: 'CRUDs'}
            },
            {
                path: 'shop',
                loadChildren: () => import('./views/shop/shop.module').then(m => m.ShopModule),
                data: { title: 'Shop', breadcrumb: 'SHOP'}
            },
            {
                path: 'search',
                loadChildren: () => import('./views/search-view/search-view.module').then(m => m.SearchViewModule)
            },
            {
                path: 'invoice',
                loadChildren: () => import('./views/invoice/invoice.module').then(m => m.InvoiceModule)
            },
            {
                path: 'todo',
                loadChildren: () => import('./views/todo/todo.module').then(m => m.TodoModule)
            },
            {
                path: 'orders',
                loadChildren: () => import('./views/order/order.module').then(m => m.OrderModule),
                data: { title: 'Orders', breadcrumb: 'Orders'}
            },
            {
                path: 'page-layouts',
                loadChildren: () => import('./views/page-layouts/page-layouts.module').then(m => m.PageLayoutsModule)
            },
            {
                path: 'utilities',
                loadChildren: () => import('./views/utilities/utilities.module').then(m => m.UtilitiesModule)
            },
            {
                path: 'icons',
                loadChildren: () => import('./views/mat-icons/mat-icons.module').then(m => m.MatIconsModule),
                data: { title: 'Icons', breadcrumb: 'MATICONS'}
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'sessions/404'
    }
];

