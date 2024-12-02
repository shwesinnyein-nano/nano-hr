import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

import { AuthService, DataService, SideBar, SideBarMenu, routes } from 'src/app/core/core.index';
import { SideBarService } from 'src/app/core/services/side-bar/side-bar.service';
import { UserRoleService } from 'src/app/core/services/user-role/user-role.service';
import { CommonService } from 'src/app/shared/common/common.service';

@Component({
  selector: 'app-side-menu-one',
  templateUrl: './side-menu-one.component.html',
  styleUrls: ['./side-menu-one.component.scss'],
})
export class SideMenuOneComponent implements OnDestroy {
  public routes = routes;
  public multilevel: Array<boolean> = [false, false, false];
  base = 'dashboard';
  page = '';
  last = '';
  openMenuItem: any = null;
  openSubmenuOneItem: any = null;
  side_bar_data: Array<SideBar> = [];
  constructor(
    public router: Router,
    private data: DataService,
    private sideBar: SideBarService,
    private common: CommonService,
    private authService: AuthService,
    private userRoleService: UserRoleService
  ) {

    router.events.subscribe((event: object) => {
      if (event instanceof NavigationEnd) {
        const splitVal = event.url.split('/');
        this.base = splitVal[1];
        this.page = splitVal[2];
        this.last = splitVal[3];

      }
    });
    // get sidebar data as observable because data is controlled for design to expand submenus
    this.data.getSideBarData.subscribe(async (res: Array<SideBar>) => {
      this.side_bar_data = res;

      try {
        const uid = await this.authService.getUid();
        this.userRoleService.getMenuAccess(uid).subscribe((menuData: any) => {
          console.log("menuData", menuData);
          if (menuData && menuData.menuAccess) {
            console.log("menuGroup", this.side_bar_data);

            // Map over each menu group and menu item to assign permissions
            this.side_bar_data = this.side_bar_data.map((menuGroup: any) => {
              const access = menuData.menuAccess.find((accessItem: any) => accessItem.menuValue === menuGroup.menuValue);
              return {
                ...menuGroup,
                permissions: access
                  ? {
                    read: access.read || false,
                    write: access.write || false,
                    create: access.create || false,
                    delete: access.delete || false,
                  }
                  : { read: true, write: true, create: true, delete: true }, // Default permissions
              };
            })
          }
          else{
            this.side_bar_data = this.side_bar_data.map((menuGroup: any) => {
              // const access = menuData.menuAccess.find((accessItem: any) => accessItem.menuValue === menuGroup.menuValue);
              return {
                ...menuGroup,
                permissions: 
                   { read: true, write: true, create: true, delete: true }, // Default permissions
              };
            })

          }
          console.log("Updated side_bar_data with permissions", this.side_bar_data);
        });
        // this.userRoleService.getMenuAccess(uid).subscribe((menuData: any) => {
        //   // console.log("menuData", menuData);
        //   if (menuData.menuAccess) {
        //     // Map permissions to `menu` inside `side_bar_data`
        //     this.side_bar_data = this.side_bar_data.map((menuGroup: any) => {
        //       return {
        //         ...menuGroup,
        //         menu: menuGroup.menu.map((menuItem: any) => {
        //           // Find the corresponding menu in `menuAccess`
        //           const access = menuData.menuAccess.find((accessItem: any) => accessItem.menuValue === menuItem.menuValue);

        //           // If found, assign permissions; otherwise, set default permissions
        //           return {
        //             ...menuItem,
        //             permissions: access
        //               ? {
        //                 read: access.read || false,
        //                 write: access.write || false,
        //                 create: access.create || false,
        //                 delete: access.delete || false,
        //               }
        //               : { read: true, write: true, create: true, delete: true }, // Default permissions
        //           };
        //         }),
        //       };
        //     });
        //   }
        //   console.log("Updated side_bar_data with permissions", this.side_bar_data);
        // });

      } catch (error) {
        console.error("Error fetching UID:", error);
      }
    });


    this.common.base.subscribe((res: string) => {
      this.base = res;
    });
    this.common.page.subscribe((res: string) => {
      this.page = res;
    });
    this.common.page.subscribe((res: string) => {
      this.last = res;
    });
  }


  public miniSideBarMouseHover(position: string): void {
    if (position === 'over') {
      this.sideBar.expandSideBar.next(true);
    } else {
      this.sideBar.expandSideBar.next(false);
    }
  }
  public expandSubMenus(menu: SideBarMenu): void {
    sessionStorage.setItem('menuValue', menu.menuValue);
    this.side_bar_data.map((mainMenus: SideBar) => {
      mainMenus.menu.map((resMenu: SideBarMenu) => {
        // collapse other submenus which are open
        if (resMenu.menuValue === menu.menuValue) {
          menu.showSubRoute = !menu.showSubRoute;
          if (menu.showSubRoute === false) {
            sessionStorage.removeItem('menuValue');
          }
        } else {
          resMenu.showSubRoute = false;
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.data.resetData();
  }
  miniSideBarBlur(position: string) {
    if (position === 'over') {
      this.sideBar.expandSideBar.next(true);
    } else {
      this.sideBar.expandSideBar.next(false);
    }
  }

  miniSideBarFocus(position: string) {
    if (position === 'over') {
      this.sideBar.expandSideBar.next(true);
    } else {
      this.sideBar.expandSideBar.next(false);
    }
  }
  openMenu(menu: any): void {
    if (this.openMenuItem === menu) {
      this.openMenuItem = null;
    } else {
      this.openMenuItem = menu;
    }
  }
  openSubmenuOne(subMenus: any): void {
    if (this.openSubmenuOneItem === subMenus) {
      this.openSubmenuOneItem = null;
    } else {
      this.openSubmenuOneItem = subMenus;
    }
  }
  shouldDisplayMenu(mainTittle: any): boolean {
    // console.log("mainTittle", mainTittle);
    
    return mainTittle.menu.some((menu: any) =>
      menu.permissions?.read !== false 
      // menu.subMenus?.some((subMenu: any) => subMenu.permissions?.read !== false)
    );
  }
}
