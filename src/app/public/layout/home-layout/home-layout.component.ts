import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { NavegationComponent } from "../../navegation/navegation.component";

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [RouterOutlet, NavegationComponent],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.css'
})
export class HomeLayoutComponent {

}
