import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../app/services/supabase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  standalone: true, // Si dice true, estás en este escenario
  imports: [CommonModule, FormsModule], // 🔥 AGREGA LA IMPORTACIÓN AQUÍ
  styleUrls: ['./admin.component.css']

}) // <-- Quitamos el satisfies Component de aquí

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
    // Aquí podrías validar si ya había una sesión activa, por ahora iniciamos limpio
  }

  async manejarLogin(): Promise<void> {
    try {
      this.errorLogin = '';
      await this.supabaseService.login(this.email, this.password);
      this.estaLogueado = true;
      this.cargarPedidos(); // En cuanto entra, cargamos las órdenes
    } catch (error: any) {
      this.errorLogin = 'Credenciales incorrectas o usuario no válido.';
      console.error(error);
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
    await this.supabaseService.logout();
    this.estaLogueado = false;
    this.pedidos = [];
  }
}