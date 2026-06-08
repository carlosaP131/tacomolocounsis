import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    // Inicializa el cliente con las llaves del environment actual
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Método para obtener los tacos del menú en tiempo real
  async obtenerMenu() {
    const { data, error } = await this.supabase
      .from('menu') // El nombre exacto de tu tabla en Supabase
      .select('*'); 
    
    if (error) {
      console.error('Error al traer el menú:', error);
      throw error;
    }
    return data;
  }
  // Agrega este método dentro de tu clase SupabaseService
async guardarPedidoEnBD(pedido: { articulos: any[]; total: number }) {
  const { data, error } = await this.supabase
    .from('pedidos') // Nombre de tu nueva tabla
    .insert([
      { 
        articulos: pedido.articulos, 
        total: pedido.total 
      }
    ]);

  if (error) {
    console.error('Error al registrar la comanda en Supabase:', error);
    throw error;
  }
  return data;
}
// Agrega estos métodos en tu src/app/services/supabase.service.ts

// 1. Iniciar sesión con Supabase Auth
async login(email: string, password: string) {
  const { data, error } = await this.supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

// 2. Cerrar sesión
async logout() {
  const { error } = await this.supabase.auth.signOut();
  if (error) throw error;
}

// 3. Obtener los pedidos ordenados (los más nuevos primero)
async obtenerPedidos() {
  const { data, error } = await this.supabase
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false }); // Lo más nuevo arriba

  if (error) {
    console.error('Error al traer pedidos:', error);
    throw error;
  }
  return data;
}
}