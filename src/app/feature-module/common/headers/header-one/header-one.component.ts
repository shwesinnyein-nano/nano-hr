import { Component } from '@angular/core';

import { SideBarService } from 'src/app/core/services/side-bar/side-bar.service';
import { NavigationEnd, Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { UserRoleService } from 'src/app/core/services/user-role/user-role.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeModalComponent } from 'src/app/feature-module/employee/employees/all-employee/employee-modal/employee-modal.component';
import { LanguagesService } from 'src/app/core/services/languages/languages.service';

@Component({
  selector: 'app-header-one',
  templateUrl: './header-one.component.html',
  styleUrls: ['./header-one.component.scss'],
})
export class HeaderOneComponent {
  public base = '';
  public page = '';
  public routes = routes;
  public miniSidebar = false;
  public baricon = false;
  isDarkMode: boolean = false;
  displayName: string = '';
  userData: any;
  selectedLanguage: string = 'EN';

  constructor(
    private sideBar: SideBarService,
    private router: Router,
    private userRoleService: UserRoleService,
    private authService: AuthService,
    private modalService: NgbModal,
    private _languageService: LanguagesService

  ) {
    this.sideBar.toggleSideBar.subscribe((res: string) => {
      if (res === 'true') {
        this.miniSidebar = true;
      } else {
        this.miniSidebar = false;
      }
    });
    router.events.subscribe((event: object) => {
      if (event instanceof NavigationEnd) {
        const splitVal = event.url.split('/');
        this.base = splitVal[1];
        this.page = splitVal[2];
        if (
          this.base === 'components' ||
          this.page === 'tasks' ||
          this.page === 'email'
        ) {
          this.baricon = false;
          localStorage.setItem('baricon', 'false');
        } else {
          this.baricon = true;
          localStorage.setItem('baricon', 'true');
        }
      }
    });
    if (localStorage.getItem('baricon') == 'true') {
      this.baricon = true;
    } else {
      this.baricon = false;
    }
  }
  async ngOnInit(){
    this.isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    this.applyTheme();
    const userId = await this.authService.getCurrentUserId();
    if (userId) {
      console.log("userId", userId);
      this.userRoleService.getUserByUid(userId).subscribe((res: any) => {
        console.log("userData", res);
        this.userData = res;
        this.displayName = res.firstName + ' ' + res.lastName;
      });
    } else {
      console.error("User ID is null or undefined");
    }
    const langs = localStorage.getItem('kbzDefaultLanguage') || 'EN';
    console.log("langs", langs);
    this.changeLanguage(langs);
  }

  openProfileModal(){
    console.log("openProfileModal");
    const modalRef = this.modalService.open(EmployeeModalComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.data = this.userData;
    modalRef.componentInstance.isEdit = true;

    modalRef.result.then((result: any) => {
      console.log("edit result", result);
      if(result.data) {
        this.userRoleService.updateUserData(result.data.uid, result.data).subscribe((res: any) => {
          console.log("res", res);
          if(res.success){

          }
        })
      }
    });

  }

  changeLanguage(language: string) {

    this.selectedLanguage = language;
    this._languageService.setLanguage(language);
  }

  public toggleSideBar(): void {
    this.sideBar.switchSideMenuPosition();
  }

  public togglesMobileSideBar(): void {
    this.sideBar.switchMobileSideBarPosition();
  }
  navigation() {
    this.router.navigate([routes.search]);
  }
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('isDarkMode', this.isDarkMode.toString());
    this.applyTheme();
  }
  applyTheme() {
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }

}
