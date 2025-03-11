import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from "../../components/login/login.component";

@Component({
  selector: 'app-aside',
  imports: [RouterModule, LoginComponent],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent {

}
