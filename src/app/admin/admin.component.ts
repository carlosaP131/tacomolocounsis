import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../app/services/supabase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  // Variables para el Login
  email = '';
  password = '';
  errorLogin = '';
  estaLogueado = false;

  // Variables para los Pedidos
  pedidos: any[] = [];
  cargandoPedidos = false;

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit(): void {
    // 💡 Opcional: Podrías verificar si ya hay una sesión activa en Supabase para no pedir login otra vez
  }

  async manejarLogin(): Promise<void> {
    try {
      this.errorLogin = '';
      this.cargandoPedidos = true; // Activamos bandera de carga

      // 1. Limpiamos espacios raros que se van en el teclado (muy común)
      const correoLimpio = this.email.trim();
      const passLimpia = this.password.trim();

      // 2. Cachamos la respuesta real de Supabase
      const resultado = await this.supabaseService.login(correoLimpio, passLimpia);
      
      // 3. Validamos si Supabase nos regresó un usuario válido
      if (resultado && resultado.user) {
        this.estaLogueado = true;
        await this.cargarPedidos(); // Esperamos a que carguen las comandas antes de cambiar la vista
      } else {
        // Si no hay usuario pero tampoco lanzó excepción
        this.estaLogueado = false;
        this.errorLogin = 'No se pudo iniciar sesión. Intenta de nuevo.';
      }

    } catch (error: any) {
      this.estaLogueado = false;
      // Mostramos en el HTML el mensaje real de Supabase para saber exactamente qué falla
      this.errorLogin = error.message || 'Credenciales incorrectas o usuario no válido.';
      console.error('Error detallado de Supabase:', error);
    } finally {
      this.cargandoPedidos = false; // Apagamos la carga
    }
  }

  async cargarPedidos(): Promise<void> {
    try {
      this.cargandoPedidos = true;
      this.pedidos = await this.supabaseService.obtenerPedidos();
    } catch (error) {
      console.error('Error al cargar la lista de pedidos:', error);
    } finally {
      this.cargandoPedidos = false;
    }
  }

  async manejarLogout(): Promise<void> {
    try {
      await this.supabaseService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      this.estaLogueado = false;
      this.pedidos = [];
    }
  }
}