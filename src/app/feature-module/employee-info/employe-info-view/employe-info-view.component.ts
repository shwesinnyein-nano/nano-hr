import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { routes } from 'src/app/core/core.index';


@Component({
  selector: 'app-employe-info-view',
 
  templateUrl: './employe-info-view.component.html',
  styleUrl: './employe-info-view.component.scss'
})
export class EmployeInfoViewComponent implements OnInit{

  public routes = routes;
  public data: any;
  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      console.log("params", params);
      this.data = JSON.parse(params.data);
    });
   
  }
}
