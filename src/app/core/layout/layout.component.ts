import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../components/header/header.component";
import { ToastModule } from 'primeng/toast';

@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html',
	styleUrl: './layout.component.scss',
	imports: [
		RouterOutlet,
		HeaderComponent,
		ToastModule
	]
})
export class LayoutComponent {

}
