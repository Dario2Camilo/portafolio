import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductoInterface } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  cargando = true;
  productos: ProductoInterface [] = [];
  productosFiltrado: ProductoInterface [] = [];

  constructor( private http: HttpClient ) {

    this.cargarProductos();

  }


  private cargarProductos() {

    return new Promise( (resolve, reject ) => {

      this.http.get('https://angular-html-6ebfc.firebaseio.com/productos_idx.json')
      .subscribe( (resp: ProductoInterface[]) => {
        this.productos = resp;
        setTimeout(() => {
          this.cargando = false;
          resolve();
        }, 2000);
      } );

    });
  }

  getProducto( id: string ) {

    return this.http.get(`https://angular-html-6ebfc.firebaseio.com/productos/${ id }.json`);

  }

  buscarProducto( termino: string ) {

    if ( this.productos.length === 0 ) {
      // cargar productos
      this.cargarProductos().then(() => {
        // ejecutar despues de tener los productos
        // aplicar filtro
        this.filtraProductos( termino );
      });
    } else {
      // aplicar el filtro
      this.filtraProductos( termino );
    }

  }

  private filtraProductos( termino: string ) {
    /* console.log(this.productos); */
    this.productosFiltrado = [];

    termino = termino.toLocaleLowerCase();

    this.productos.forEach( prod => {
      const titulolower = prod.titulo.toLocaleLowerCase();

      if ( prod.categoria.indexOf( termino ) >= 0 || titulolower.indexOf( termino ) >= 0 ) {
        this.productosFiltrado.push( prod );
      }
    });
  }

}
