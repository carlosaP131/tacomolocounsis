import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Definimos la estructura de un producto en el carrito
interface ItemCarrito {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  categoriaActiva: string = 'trompo';
  
  // Arreglo que almacenará los productos del carrito
  carrito: ItemCarrito[] = [];

  cambiarCategoria(categoria: string): void {
    this.categoriaActiva = categoria;
  }

  // Agregar producto al carrito o incrementar su cantidad
  agregarAlCarrito(id: number, nombre: string, precio: number): void {
    const itemExistente = this.carrito.find(item => item.id === id);

    if (itemExistente) {
      itemExistente.cantidad += 1;
    } else {
      this.carrito.push({ id, nombre, precio, cantidad: 1 });
    }
  }

  // Modificar cantidad directamente desde el carrito
  cambiarCantidad(id: number, cambio: number): void {
    const item = this.carrito.find(i => i.id === id);
    if (item) {
      item.cantidad += cambio;
      // Si la cantidad llega a 0, lo eliminamos del carrito
      if (item.cantidad <= 0) {
        this.eliminarDelCarrito(id);
      }
    }
  }

  eliminarDelCarrito(id: number): void {
    this.carrito = this.carrito.filter(item => item.id !== id);
  }

  // Obtener el total de piezas en el carrito (para el badge)
  get totalProductos(): number {
    return this.carrito.reduce((acc, item) => acc + item.cantidad, 0);
  }

  // Calcular el precio total de la orden
  get totalPagar(): number {
    return this.carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  }

  // Simular el envío del pedido a WhatsApp o backend
  enviarPedido(): void {
    if (this.carrito.length === 0) return;
    
    let mensaje = '¡Hola! Me gustaría hacer el siguiente pedido en Tacomoloco:\n\n';
    this.carrito.forEach(item => {
      mensaje += `• ${item.cantidad}x ${item.nombre} ($${item.precio * item.cantidad})\n`;
    });
    mensaje += `\n*Total a pagar: $${this.totalPagar}*`;
    
    // Codifica el texto para URL y abre WhatsApp en una nueva pestaña
    const urlWhatsapp = `https://wa.me/5211234567890?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsapp, '_blank');
  }
}