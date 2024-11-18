import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';

@Component({
  selector: 'app-jobs-header',
  templateUrl: './jobs-header.component.html',
  styleUrls: ['./jobs-header.component.scss']
})
export class JobsHeaderComponent {
  public routes = routes;
  isDarkMode = false;
  navigation(){
    this.router.navigate([routes.search])
  }
  constructor(private router: Router){

  }

  ngOnInit(){
    this.applyTheme();
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


      loginCard.style.border = '1px solid #d1b07d';
    if (this.isDarkMode) {
      // Optional: body background color
      if (loginCard) {
        loginCard.style.backgroundColor = '#000001'; // Dark mode background for card
        loginCard.style.color = 'white'; // Light text color for dark mode
      }
    }
    else {
      // Optional: body background color
      loginCard.style.color = 'black'

      loginCard.style.border = '1px solid #333';
      loginCard.style.backgroundColor = '#f9f9f9'; // Light mode background for card
      loginCard.style.color = '#333'; // Dark text color for light mode

    }

  }
}
