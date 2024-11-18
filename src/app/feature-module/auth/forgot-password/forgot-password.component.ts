import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import { CommonService } from 'src/app/shared/common/common.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  public routes = routes;
  base = '';
  page = '';
  last = '';
  isDarkMode: boolean = false;
  constructor(
    private common: CommonService,
    private renderer: Renderer2,
  ) {
    this.common.base.subscribe((res: string) => {
      this.base = res;
    });
    this.common.page.subscribe((res: string) => {
      this.page = res;
    });
    this.common.last.subscribe((res: string) => {
      this.last = res;
    });
    if (this.base == 'forgot-password') {
      this.renderer.addClass(document.body, 'account-page');
    }
  }
  ngOnInit() {
    this.applyTheme();
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'account-page');
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    console.log("this.isDarkMode", this.isDarkMode);
    this.applyTheme();
    const darkcolor = this.isDarkMode ? '#000001' : '#34383a';
    localStorage.setItem('theme', darkcolor);
  }

  applyTheme() {
    const loginCard = document.querySelector('.account-box') as HTMLElement;
    const accountPage = document.querySelector('.account-page') as HTMLElement;

      loginCard.style.border = '1px solid #d1b07d';
    if (this.isDarkMode) {
      // Optional: body background color
      if (loginCard) {
        loginCard.style.backgroundColor = '#000001'; // Dark mode background for card
        loginCard.style.color = 'white'; // Light text color for dark mode
      }
      if (accountPage) {
        accountPage.style.backgroundColor = '#16191c'; // Dark mode background for card
        accountPage.style.color = 'white'; // Light text color for dark mode
      }
    }
    else {
      // Optional: body background color
      loginCard.style.color = 'black'
      accountPage.style.backgroundColor = '#f9f9f9';
      loginCard.style.border = '1px solid #333';
      loginCard.style.backgroundColor = '#f9f9f9'; // Light mode background for card
      loginCard.style.color = '#333'; // Dark text color for light mode

    }

  }
}
