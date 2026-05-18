import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  imports: [RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
// Variable para controlar si el dropdown está abierto o cerrado internamente
  dropdownAbierto: boolean = false;

  // Alterna o congela el estado al dar clic en el botón principal
  toggleDropdown(event: Event): void {
    event.stopPropagation(); // Evita que clicks externos cierren el flujo inmediatamente si no lo deseas
    this.dropdownAbierto = !this.dropdownAbierto;
  }
}
