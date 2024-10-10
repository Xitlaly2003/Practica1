import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
})

export class ActivityPage {

  // Arreglo para almacenar las actividades
  listaActividades: Actividad[] = [];
  private almacenamiento: Storage | null = null;

  constructor(private alertController: AlertController, private storage: Storage) {
    this.inicializarAlmacenamiento();
  }

  // Inicialización del sistema de almacenamiento
  async inicializarAlmacenamiento() {
    this.almacenamiento = await this.storage.create();
    this.cargarActividades();
  }

  // Carga las actividades guardadas en el almacenamiento
  async cargarActividades() {
    const actividadesGuardadas = await this.storage.get('listaActividades');
    if (actividadesGuardadas) {
      this.listaActividades = actividadesGuardadas;
    }
  }

  // Guarda las actividades en el almacenamiento
  async guardarActividades() {
    await this.storage.set('listaActividades', this.listaActividades);
  }

  // Crea una nueva actividad y la agrega al listado
  async agregarActividad() {
    const alerta = await this.alertController.create({
      header: 'Nueva Actividad',
      inputs: [
        { name: 'tipo', type: 'text', placeholder: 'Tipo de Actividad (Ej. Correr)' },
        { name: 'duracion', type: 'number', placeholder: 'Duración (minutos)' },
        { name: 'fecha', type: 'date', placeholder: 'Fecha de la actividad' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Añadir',
          handler: (data) => {
            // Se agrega la actividad al arreglo
            this.listaActividades.push({
              tipo: data.tipo,
              duracion: data.duracion,
              fecha: new Date(data.fecha)
            });
            this.guardarActividades(); // Guarda los cambios
          }
        }
      ]
    });
    await alerta.present();
  }

  // Edita una actividad existente
  async modificarActividad(actividad: Actividad) {
    const alerta = await this.alertController.create({
      header: 'Editar Actividad',
      inputs: [
        { name: 'tipo', type: 'text', value: actividad.tipo, placeholder: 'Tipo de Actividad' },
        { name: 'duracion', type: 'number', value: actividad.duracion, placeholder: 'Duración (minutos)' },
        { name: 'fecha', type: 'date', value: this.convertirFecha(actividad.fecha), placeholder: 'Fecha de la Actividad' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            // Se actualizan los valores de la actividad
            actividad.tipo = data.tipo;
            actividad.duracion = data.duracion;
            actividad.fecha = new Date(data.fecha);
            this.guardarActividades(); // Guarda los cambios
          }
        }
      ]
    });
    await alerta.present();
  }

  // Elimina una actividad del arreglo
  async eliminarActividad(actividad: Actividad) {
    const alerta = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Deseas eliminar la actividad "${actividad.tipo}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            // Filtra la actividad eliminada del arreglo
            this.listaActividades = this.listaActividades.filter(a => a !== actividad);
            this.guardarActividades(); // Guarda los cambios
          }
        }
      ]
    });
    await alerta.present();
  }

  // Convierte una fecha en un formato aceptado por el input de fecha
  convertirFecha(fecha: Date): string {
    const dateObj = new Date(fecha);
    const mes = '' + (dateObj.getMonth() + 1);
    const dia = '' + dateObj.getDate();
    const año = dateObj.getFullYear();
    return [año, mes.padStart(2, '0'), dia.padStart(2, '0')].join('-');
  }
}

// Definir la estructura de una Actividad
interface Actividad {
  tipo: string;
  duracion: number;
  fecha: Date;
}
