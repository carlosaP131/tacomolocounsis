import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ubicacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ubicacion.component.html',
  styleUrl: './ubicacion.component.css'
})
export class UbicacionComponent {
  // Datos del negocio
  direccionExacta: string = 'Calle Principal S/N, Centro, Miahuatlán de Porfirio Díaz, Oaxaca, C.P. 70800';
  referencia: string = 'A unos pasos de la Universidad de la Sierra Sur (UNSIS)';
  
  // URL de Google Maps para navegación (reemplázala por el enlace de tu ubicación real)
  urlGoogleMaps: string = 'https://maps.google.com/?q=Miahuatlán+de+Porfirio+Díaz+Oaxaca';

  abrirMapa(): void {
    window.open(this.urlGoogleMaps, '_blank');
  }
}