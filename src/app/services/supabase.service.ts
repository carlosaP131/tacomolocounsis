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
}