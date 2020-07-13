import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/user/login/login.component';
import { SkinMattersComponent } from './components/skin-matters/skin-matters.component';
import { ProductsComponent } from './components/skin-matters/skm-products/products.component';
import { HomeComponent } from './components/skin-matters/skm-home/home.component';
import { ProductDetailsComponent } from './components/skin-matters/skm-product-details/product-details.component';
import { CheckoutComponent } from './components/skin-matters/skm-checkout/checkout.component';
import { ProfileComponent } from './components/skin-matters/skm-profile/profile.component';
//Admin Components
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminComponent } from './components/admin/admin.component'
import { RegisterComponent } from './components/user/register/register.component';
import { UserComponent } from './components/user/user.component';
import { BeforeLoginService } from './services/before-login.service';
import { AfterLoginService } from './services/after-login.service';
import { AdminDistributorsComponent } from './components/admin/admin-distributors/admin-distributors.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';
import { AdminProductsComponent } from './components/admin/admin-products/admin-products.component';
import { AdminProductDetailComponent } from './components/admin/admin-product-detail/admin-product-detail.component';
import { AdminOrderDetailComponent } from './components/admin/admin-order-detail/admin-order-detail.component';
import { AdminDistributorDetailComponent } from './components/admin/admin-distributor-detail/admin-distributor-detail.component';
import { OrdersComponent } from './components/skin-matters/skm-profile/orders/orders.component';
import { AccountDetailsComponent } from './components/skin-matters/skm-profile/account-details/account-details.component';
import { OrderDetailsComponent } from './components/skin-matters/skm-profile/orders/order-details/order-details.component';
import { AddressesComponent } from './components/skin-matters/skm-profile/addresses/addresses.component';
import { AdminProductCreateComponent } from './components/admin/admin-product-create/admin-product-create.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AdminUserDetailComponent } from './components/admin/admin-user-detail/admin-user-detail.component';
import { AdminUserCreateComponent } from './components/admin/admin-user-create/admin-user-create.component';
import { AdminCategoriesComponent } from './components/admin/admin-categories/admin-categories.component';
import { AdminCategoriesCreateComponent } from './components/admin/admin-categories-create/admin-categories-create.component';
import { AdminCategoriesDetailComponent } from './components/admin/admin-categories-detail/admin-categories-detail.component';
import { AdminRewardsComponent } from './components/admin/admin-rewards/admin-rewards.component';
import { AdminRewardDetailComponent } from './components/admin/admin-reward-detail/admin-reward-detail.component';
import { AdminRewardCreateComponent } from './components/admin/admin-reward-create/admin-reward-create.component';
import { AdminSalesComponent } from './components/admin/admin-sales/admin-sales.component';
import { SkmRewardsComponent } from './components/skin-matters/skm-rewards/skm-rewards.component';
import { SkmRewardDetailsComponent } from './components/skin-matters/skm-reward-details/skm-reward-details.component';
import { AdminPaymentsComponent } from './components/admin/admin-payments/admin-payments.component';
import { AdminPaymentCreateComponent } from './components/admin/admin-payment-create/admin-payment-create.component';
import { AdminPaymentDetailComponent } from './components/admin/admin-payment-detail/admin-payment-detail.component';

//url and component connection
const routes: Routes = [
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'register',
    component: RegisterComponent
  },
  {
    path:'admin',
    component: AdminComponent,
    canActivate: [AfterLoginService],
    children: [
      {
        path:'dashboard',
        component: AdminDashboardComponent
      },
      //Distributor Route
      {
        path:'distributors',
        component: AdminDistributorsComponent
      },
      {
        path:'distributors/:distributorId',
        component: AdminDistributorDetailComponent
      },
      //Order Route
      {
        path:'orders',
        component: AdminOrdersComponent
      }, 
      {
        path:'orders/:orderId',
        component: AdminOrderDetailComponent
      },
      //Product Route
      {
        path:'products',
        component: AdminProductsComponent
      },
      {
        path:'products/create',
        component: AdminProductCreateComponent
      },
      {
        path:'products/:productId',
        component: AdminProductDetailComponent
      },
      //Categories Route
      {
        path:'categories',
        component: AdminCategoriesComponent
      },
      {
        path:'categories/create',
        component: AdminCategoriesCreateComponent
      },
      {
        path:'categories/:categorySlug',
        component: AdminCategoriesDetailComponent
      },
      //User Route
      {
        path:'users',
        component: AdminUsersComponent
      },
      {
        path:'users/create',
        component: AdminUserCreateComponent
      },
      {
        path:'users/:userId',
        component: AdminUserDetailComponent
      },
      //Rewards Route
      {
        path:'rewards',
        component: AdminRewardsComponent
      },
      {
        path:'rewards/create',
        component: AdminRewardCreateComponent
      },
      {
        path:'rewards/:rewardSlug',
        component: AdminRewardDetailComponent
      },
      //SALES
      {
        path: 'sales',
        component: AdminSalesComponent
      },
      //Payments Route
      {
        path:'payments',
        component: AdminPaymentsComponent
      },
      {
        path:'payments/create',
        component: AdminPaymentCreateComponent
      },
      {
        path:'payments/:paymentSlug',
        component: AdminPaymentDetailComponent
      },
    ]
  },
  {
    path:'',
    component: SkinMattersComponent,
    canActivate: [AfterLoginService],
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path:'products',
        component: ProductsComponent
      },
      {
        path:'products/:categorySlug',
        component: ProductsComponent
      },
      {
        path:'product/:productSlug',
        component: ProductDetailsComponent
      },
      {
        path:'rewards',
        component: SkmRewardsComponent
      },
      {
        path:'reward/:rewardSlug',
        component: SkmRewardDetailsComponent
      },
      {
        path:'checkout',
        component: CheckoutComponent
      },
      {
        path:'profile',
        component: ProfileComponent,
        children: [
          {
            path: '',
            component: AccountDetailsComponent
          },
          {
            path: 'addresses',
            component: AddressesComponent
          },
          {
            path: 'orders',
            component: OrdersComponent
          },
          {
            path: 'orders/:orderId',
            component: OrderDetailsComponent
          },
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
