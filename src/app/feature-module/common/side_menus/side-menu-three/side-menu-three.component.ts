import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import {
  AuthService,
  DataService,
  SideBar,
  SideBarMenu,
  routes,
} from 'src/app/core/core.index';
import { SideBarService } from 'src/app/core/services/side-bar/side-bar.service';
import { UserRoleService } from 'src/app/core/services/user-role/user-role.service';

@Component({
  selector: 'app-side-menu-three',
  templateUrl: './side-menu-three.component.html',
  styleUrls: ['./side-menu-three.component.scss'],
})
export class SideMenuThreeComponent implements OnDestroy {
  public routes = routes;
  showSubMenusTab = false;
  base = 'dashboard';
  page = '';

  side_bar_data: Array<SideBarMenu> = [];
  constructor(
    public router: Router,
    private data: DataService,
    private sideBar: SideBarService,
    private authService: AuthService,
    private userRoleService: UserRoleService
  ) {
    router.events.subscribe((event: object) => {
      if (event instanceof NavigationEnd) {
        const splitVal = event.url.split('/');
        this.base = splitVal[1];
        this.page = splitVal[2];
      }
    });
    // get sidebar data as observable because data is controlled for design to expand submenus
    // this.data.getSideBarData.subscribe((res: Array<SideBar>) => {
    //   res.map((data: SideBar) => {
    //     data.menu.map((menus: SideBarMenu) => {
    //       this.side_bar_data.push(menus);
    //       menus.showMyTab = false;
    //     });
    //     this.side_bar_data[0].showMyTab = true;
    //   });
    // });
    this.data.getSideBarData.subscribe(async (res: Array<SideBar>) => {
      res.map((data: SideBar) => {
        data.menu.map((menus: SideBarMenu) => {
          this.side_bar_data.push(menus);
          menus.showMyTab = false;
        });
        this.side_bar_data[0].showMyTab = true;
      });
      try {
        const uid = await this.authService.getUid();
        this.userRoleService.getMenuAccess(uid).subscribe((menuData: any) => {
          // console.log("menuData", menuData);
          if (menuData && menuData.menuAccess) {
            // console.log("menuGroup", this.side_bar_data);

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
          else {
            this.side_bar_data = this.side_bar_data.map((menuGroup: any) => {
              // const access = menuData.menuAccess.find((accessItem: any) => accessItem.menuValue === menuGroup.menuValue);
              return {
                ...menuGroup,
                permissions:
                  { read: true, write: true, create: true, delete: true }, // Default permissions
              };
            })

          }
          // console.log("Updated side_bar_data with permissions", this.side_bar_data);
        });

      } catch (error) {
        console.error("Error fetching UID:", error);
      }
    });


    this.sideBar.toggleSideBar.subscribe((res: string) => {
      if (res === 'true' || res === 'true') this.showSubMenusTab = true;
      else this.showSubMenusTab = false;
    });
  }
  public toggleSideBar(): void {
    console.log("clicked");


  }

  public showTabs(mainTittle: SideBarMenu): void {
    this.side_bar_data.map((mainMenus: SideBarMenu) => {
      if (mainTittle.menuValue === mainMenus.menuValue) {
        mainMenus.showMyTab = true;
        // this.sideBar.expandSideBar.next(true);
        // this.showSubMenusTab = false;
      } else {
        mainMenus.showMyTab = false;
      }
    });
  }
  public miniSideBarMouseHover(position: string): void {
    this.sideBar.toggleSideBar.subscribe((res: string) => {
      if (res === 'true' || res === 'true') {
        if (position === 'over') {
          this.sideBar.expandSideBar.next(true);
          this.showSubMenusTab = false;
        } else {
          this.sideBar.expandSideBar.next(false);
          this.showSubMenusTab = true;
        }
      }
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
  public submenus = false;
  openSubmenus() {
    this.submenus = !this.submenus;
  }
  trackMainTittle(index: number, item: any): string {
    return item.menuValue; // or another unique identifier for the menu item
  }

}
