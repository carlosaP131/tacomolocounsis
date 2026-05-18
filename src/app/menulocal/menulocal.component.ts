import { Component, OnInit } from '@angular/core'; // 1. Importamos OnInit
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router'; // 2. Importamos ActivatedRoute

interface Platillo {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  detalles: string;
  badge?: string;
}

@Component({
  selector: 'app-menulocal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menulocal.component.html',
  styleUrl: './menulocal.component.css'
})
export class MenuLocalComponent implements OnInit { // 3. Implementamos OnInit
  
  categoriaActiva: string = 'trompo';
  platilloSeleccionado: Platillo | null = null;

  platillos: Record<string, Platillo[]> = {
    trompo: [
      {
        id: 1,
        nombre: 'Taco al Pastor Clásico',
        descripcion: 'Cerdo marinado en adobo secreto de chiles secos y axiote, piña fresca y jardín.',
        precio: 18,
        imagen: 'img/pastor.jpeg',
        detalles: 'Servido con doble tortilla de maíz de nixtamal, cebolla, cilantro, piña asada al momento y limones frescos.',
        badge: 'El Rey'
      },
      {
        id: 2,
        nombre: 'Gringa Loca',
        descripcion: 'Tortilla de harina grande, costra de queso asadero derretido y carne al pastor.',
        precio: 65,
        imagen: 'img/gringa.jpg',
        detalles: 'Preparada en tortilla de harina de 25cm, queso asadero premium de la región fundido a la plancha.'
      },
      {
        id: 3,
        nombre: 'El Volcán',
        descripcion: 'Tortilla de maíz tostada crujiente a las brasas, cama de queso fundido e hilos de pastor.',
        precio: 35,
        imagen: 'img/volcan.jpg',
        detalles: 'Base de tortilla deshidratada lentamente al carbón para lograr el crujiente perfecto, cubierta de queso fundido.'
      }
    ],
    parrilla: [
      {
        id: 4,
        nombre: 'Taco de Asada / Bistec',
        descripcion: 'Jugosa pulpa de res picada, cocinada con carbón de mezquite para un toque ahumado.',
        precio: 22,
        imagen: 'img/arrachera.jpeg',
        detalles: 'Corte de res seleccionado, marinado suavemente y asado a fuego directo con carbón vegetal.'
      },
      {
        id: 5,
        nombre: 'Suadero Confitado',
        descripcion: 'Pecho de res cocinado horas en su propio jugo. Suave por dentro, doradito por fuera.',
        precio: 20,
        imagen: 'img/suadero.jpg',
        detalles: 'Tradicional suadero estilo CDMX, cocinado en choricera a fuego lento y picado finamente sobre la tabla.'
      },
      {
        id: 6,
        nombre: 'Campechano Especial',
        descripcion: 'La combinación perfecta: Carne de asada, chorizo artesanal y chicharrón crujiente.',
        precio: 25,
        imagen: 'img/campechano.jpg',
        detalles: 'El favorito de los indecisos. Mezcla balanceada de res, embutido de la casa y coronado con chicharrón seco picado.',
        badge: 'Bomba'
      }
    ],
    bebidas: [
      {
        id: 7,
        nombre: 'Horchata Cremosa',
        descripcion: 'Agua artesanal hecha desde cero con arroz seleccionado, lácteos y vainilla.',
        precio: 30,
        imagen: 'img/Horchata.jpg',
        detalles: 'Bebida refrescante de la casa hecha diariamente, endulzada con un toque de canela entera.'
      },
      {
        id: 8,
        nombre: 'Jamaica Refrescante',
        descripcion: 'Concentrado 100% natural de flor de Jamaica, perfecta para las salsas.',
        precio: 30,
        imagen: 'img/jamaica.jpg',
        detalles: 'Flor de Jamaica premium hervida artesanalmente, servida con abundante hielo.'
      },
      {
        id: 9,
        nombre: 'COCA-COLA® Original',
        descripcion: 'Bebida refrescante de cola, el acompañante clásico para cualquier orden de tacos.',
        precio: 30,
        imagen: 'img/COCA-COLA-500ml-VR.png',
        detalles: 'Bebida refrescante de cola, el acompañante clásico para cualquier orden de tacos.'
      }
    ]
  };

  // 4. Inyectamos ActivatedRoute a través del constructor
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // 5. Nos suscribimos a los parámetros de consulta (query parameters) de la URL
    this.route.queryParams.subscribe(params => {
      const categoriaQuery = params['cat'];
      
      // Si el parámetro existe y coincide con alguna de nuestras categorías, la activamos
      if (categoriaQuery && this.platillos[categoriaQuery]) {
        this.categoriaActiva = categoriaQuery;
      }
    });
  }

  cambiarCategoria(categoria: string): void {
    this.categoriaActiva = categoria;
  }

  abrirDetalle(platillo: Platillo): void {
    this.platilloSeleccionado = platillo;
  }

  cerrarDetalle(): void {
    this.platilloSeleccionado = null;
  }
  
}