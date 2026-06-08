import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../app/services/supabase.service'; // Asegúrate de ajustar bien esta ruta de tu servicio

interface ItemCarrito {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

// Interfaz para mapear los datos que vienen de la base de datos
interface PlatilloMenu {
  etiqueta: any;
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string; // 'trompo', 'bebidas', etc.
  disponible: boolean;
  imagen_url?: string;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  categoriaActiva: string = 'trompo';

  // Arreglos de datos dinámicos
  listaPlatillos: PlatilloMenu[] = []; // Guardará todo lo que traiga Supabase
  platillosFiltrados: PlatilloMenu[] = []; // Los que se muestran según la categoría activa

  carrito: ItemCarrito[] = [];
  cargandoMenu: boolean = true; // Para poner un spinner visual si quieres

  // Inyectamos el servicio en el constructor
  constructor(private supabaseService: SupabaseService) { }

  async ngOnInit(): Promise<void> {
    await this.cargarMenuDesdeBD();
  }

  // Jala los datos desde Supabase
  async cargarMenuDesdeBD(): Promise<void> {
  try {
    this.cargandoMenu = true;
    
    // Llamamos a tu función del servicio (usa el nombre correcto que dejaste: obtenerMenu u obtenerDatosDeTabla)
    const datos = await this.supabaseService.obtenerMenu(); 
    
    this.listaPlatillos = datos as PlatilloMenu[];
    
    // 🔥 ESTA LÍNEA ES CLAVE: Aplica el filtro en cuanto llegan los datos
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

  // Filtra en memoria para no volver a hacer peticiones a la BD cada que cambias de pestaña
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

  // Envía a WhatsApp y opcionalmente guarda el pedido en tu base de datos
  async enviarPedido(): Promise<void> {
    if (this.carrito.length === 0) return;

    // --- PASO EXTRA ESCALABLE: Guardar comanda en Supabase ---
    try {
      // Si creas una tabla llamada 'pedidos', puedes meter este bloque para que guarde la venta
      /*
      await this.supabaseService.guardarPedidoEnBD({
        articulos: this.carrito,
        total: this.totalPagar,
        fecha: new Date()
      });
      */
    } catch (err) {
      console.error('No se pudo respaldar en la BD, pero enviando a WhatsApp...');
    }
    // ---------------------------------------------------------

    let mensaje = '¡Hola! Me gustaría hacer el siguiente pedido en Tacomoloco:\n\n';
    this.carrito.forEach(item => {
      mensaje += `• ${item.cantidad}x ${item.nombre} ($${item.precio * item.cantidad})\n`;
    });
    mensaje += `\n*Total a pagar: $${this.totalPagar}*`;

    const urlWhatsapp = `https://wa.me/5211234567890?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsapp, '_blank');
  }
}