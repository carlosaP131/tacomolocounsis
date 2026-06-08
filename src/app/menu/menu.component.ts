import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../app/services/supabase.service'; 
import { FormsModule } from '@angular/forms'; // Por si llegas a meter inputs bidireccionales

interface ItemCarrito {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface PlatilloMenu {
  etiqueta: any;
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string; 
  disponible: boolean;
  imagen_url?: string;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  categoriaActiva: string = 'trompo';

  // Arreglos de datos dinámicos
  listaPlatillos: PlatilloMenu[] = []; 
  platillosFiltrados: PlatilloMenu[] = []; 

  carrito: ItemCarrito[] = [];
  cargandoMenu: boolean = true; 

  // 🔥 CONFIGURACIÓN: Pon aquí el número de la taquería (Código de país 52 + 1 + 10 dígitos)
  // Ejemplo para Miahuatlán: '521951XXXXXXX' o simplemente '52951XXXXXXX' (ambos los procesa WhatsApp)
  private readonly NUMERO_WHATSAPP: string = '529514121476'; 

  constructor(private supabaseService: SupabaseService) { }

  async ngOnInit(): Promise<void> {
    await this.cargarMenuDesdeBD();
  }

  // Jala los datos desde Supabase
  async cargarMenuDesdeBD(): Promise<void> {
    try {
      this.cargandoMenu = true;
      const datos = await this.supabaseService.obtenerMenu(); 
      this.listaPlatillos = datos as PlatilloMenu[];
      this.filtrarPlatillos(); 
    } catch (error) {
      console.error('Error al conectar con el menú de Supabase:', error);
    } finally {
      this.cargandoMenu = false;
    }
  }

  cambiarCategoria(categoria: string): void {
    this.categoriaActiva = categoria;
    this.filtrarPlatillos();
  }

  filtrarPlatillos(): void {
    this.platillosFiltrados = this.listaPlatillos.filter(
      platillo => platillo.categoria === this.categoriaActiva && platillo.disponible
    );
  }

  agregarAlCarrito(id: number, nombre: string, precio: number): void {
    const itemExistente = this.carrito.find(item => item.id === id);

    if (itemExistente) {
      itemExistente.cantidad += 1;
    } else {
      this.carrito.push({ id, nombre, precio, cantidad: 1 });
    }
  }

  cambiarCantidad(id: number, cambio: number): void {
    const item = this.carrito.find(i => i.id === id);
    if (item) {
      item.cantidad += cambio;
      if (item.cantidad <= 0) {
        this.eliminarDelCarrito(id);
      }
    }
  }
  
  eliminarDelCarrito(id: number): void {
    this.carrito = this.carrito.filter(item => item.id !== id);
  }

  get totalProductos(): number {
    return this.carrito.reduce((acc, item) => acc + item.cantidad, 0);
  }

  get totalPagar(): number {
    return this.carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  }

  // 🔥 ENVÍO INTEGRADO: Respalda en Supabase y dispara la orden formateada a WhatsApp
  async enviarPedido(): Promise<void> {
    if (this.carrito.length === 0) return;
    
    // 1. Respaldar la orden en la base de datos de Supabase para el panel del personal
    try {
      // Asegúrate de que el método en tu servicio se llame exactamente así o adáptalo
      await this.supabaseService.guardarPedidoEnBD({
        articulos: this.carrito,
        total: this.totalPagar
      });
      console.log('¡Comanda registrada con éxito en el backend de Supabase!');
    } catch (err) {
      console.error('No se pudo respaldar en la BD, procediendo solo con WhatsApp...', err);
    }

    // 2. Construir el mensaje de WhatsApp bien formateado con emojis
    let mensaje = '👋 ¡Hola! Me gustaría hacer el siguiente pedido en *Tacomoloco*:\n\n';
    mensaje += '📋 *DETALLE DE LA ORDEN:*\n';
    
    this.carrito.forEach(item => {
      mensaje += `• ${item.cantidad}x ${item.nombre} — $${item.precio * item.cantidad}\n`;
    });
    
    mensaje += `\n💰 *Total a pagar: $${this.totalPagar}*\n\n`;
    mensaje += '🛵 _Por favor, confírmenme el tiempo aproximado de entrega._';
    
    // 3. Crear URL y abrir la API de WhatsApp en pestaña nueva
    const urlWhatsapp = `https://wa.me/${this.NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsapp, '_blank');

    // 4. Limpieza post-venta: Vaciamos el carrito del cliente para que quede listo para otra compra
    this.carrito = [];
  }
}