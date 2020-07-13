import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

//Third-Party Plugin
import { DataTablesModule } from 'angular-datatables';
import { DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/user/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/skin-matters/skm-home/home.component';
import { NavbarComponent } from './components/skin-matters/skm-navbar/navbar.component';
import { SkinMattersComponent } from './components/skin-matters/skin-matters.component';
import { ProductsComponent } from './components/skin-matters/skm-products/products.component';
import { ProductDetailsComponent } from './components/skin-matters/skm-product-details/product-details.component';
import { CheckoutComponent } from './components/skin-matters/skm-checkout/checkout.component';
import { ProfileComponent } from './components/skin-matters/skm-profile/profile.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminComponent } from './components/admin/admin.component';
import { RegisterComponent } from './components/user/register/register.component';
import { UserComponent } from './components/user/user.component';
import { APIService } from './services/api.service';
import { AdminDistributorsComponent } from './components/admin/admin-distributors/admin-distributors.component';
import { AdminProductsComponent } from './components/admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';
import { AdminOrderDetailComponent } from './components/admin/admin-order-detail/admin-order-detail.component';
import { AdminDistributorDetailComponent } from './components/admin/admin-distributor-detail/admin-distributor-detail.component';
import { AdminProductDetailComponent } from './components/admin/admin-product-detail/admin-product-detail.component';
import { AdminNavbarComponent } from './components/admin/admin-navigation/admin-navbar/admin-navbar.component';
import { CookieService } from 'ngx-cookie-service';
import { OrdersComponent } from './components/skin-matters/skm-profile/orders/orders.component';
import { AccountDetailsComponent } from './components/skin-matters/skm-profile/account-details/account-details.component';
import { OrderDetailsComponent } from './components/skin-matters/skm-profile/orders/order-details/order-details.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AddressesComponent } from './components/skin-matters/skm-profile/addresses/addresses.component';
import { AdminProductCreateComponent } from './components/admin/admin-product-create/admin-product-create.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { SkmFooterComponent } from './components/skin-matters/skm-footer/skm-footer.component';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AdminUserDetailComponent } from './components/admin/admin-user-detail/admin-user-detail.component';
import { AdminUserCreateComponent } from './components/admin/admin-user-create/admin-user-create.component';
import { AdminSidebarComponent } from './components/admin/admin-navigation/admin-sidebar/admin-sidebar.component'

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from './services/token-interceptor.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminCategoriesComponent } from './components/admin/admin-categories/admin-categories.component';
import { AdminCategoriesDetailComponent } from './components/admin/admin-categories-detail/admin-categories-detail.component';
import { AdminCategoriesCreateComponent } from './components/admin/admin-categories-create/admin-categories-create.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { AdminRewardsComponent } from './components/admin/admin-rewards/admin-rewards.component';
import { AdminRewardDetailComponent } from './components/admin/admin-reward-detail/admin-reward-detail.component';
import { AdminRewardCreateComponent } from './components/admin/admin-reward-create/admin-reward-create.component';

import { ImageCropperModule } from 'ngx-image-cropper';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { AdminSalesComponent } from './components/admin/admin-sales/admin-sales.component';
import { SkmRewardsComponent } from './components/skin-matters/skm-rewards/skm-rewards.component';
import { SkmRewardDetailsComponent } from './components/skin-matters/skm-reward-details/skm-reward-details.component';
import { AdminPaymentsComponent } from './components/admin/admin-payments/admin-payments.component';
import { AdminPaymentCreateComponent } from './components/admin/admin-payment-create/admin-payment-create.component';
import { AdminPaymentDetailComponent } from './components/admin/admin-payment-detail/admin-payment-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    SkinMattersComponent,
    ProductsComponent,
    ProductDetailsComponent,
    CheckoutComponent,
    ProfileComponent,
    AdminDashboardComponent,
    AdminComponent,
    RegisterComponent,
    UserComponent,
    AdminDistributorsComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    AdminOrderDetailComponent,
    AdminDistributorDetailComponent,
    AdminProductDetailComponent,
    AdminNavbarComponent,
    OrdersComponent,
    AccountDetailsComponent,
    OrderDetailsComponent,
    AddressesComponent,
    AdminProductCreateComponent,
    SkmFooterComponent,
    AdminUsersComponent,
    AdminUserDetailComponent,
    AdminUserCreateComponent,
    AdminSidebarComponent,
    AdminCategoriesComponent,
    AdminCategoriesDetailComponent,
    AdminCategoriesCreateComponent,
    AdminRewardsComponent,
    AdminRewardDetailComponent,
    AdminRewardCreateComponent,
    AdminSalesComponent,
    SkmRewardsComponent,
    SkmRewardDetailsComponent,
    AdminPaymentsComponent,
    AdminPaymentCreateComponent,
    AdminPaymentDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    DataTablesModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    CollapseModule,
    CarouselModule.forRoot(),
    SweetAlert2Module,
    FontAwesomeModule,
    PaginationModule.forRoot(),
    ImageCropperModule,
    DragDropModule,
    NgxImageZoomModule,
    DateTimePickerModule,
  ],
  providers: [
    CookieService,
    APIService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
