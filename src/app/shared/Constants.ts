import {Injectable} from '@angular/core';

@Injectable()
export class Constants {
  numberByPage = 25;
  datatable = { en : {
    emptyTable: 'No data available in table',
    info: 'Showing _START_ to _END_ of _TOTAL_ entries',
    infoEmpty: 'Showing 0 to 0 of 0 entries',
    infoFiltered: '(filtered from _MAX_ total entries)',
    infoThousands: ',',
    lengthMenu: 'Show _MENU_ entries',
    loadingRecords: 'Loading...',
    processing: 'Processing...',
    search: 'Search:',
    zeroRecords: 'No matching records found',
    thousands: ',',
    paginate: {
      first: 'First',
      last: 'Last',
      next: 'Next',
      previous: 'Previous'
    },
    aria: {
      sortAscending: ': activate to sort column ascending',
      sortDescending: ': activate to sort column descending'
    },
    autoFill: {
      cancel: 'Cancel',
      fill: 'Fill all cells with <i>%d<\/i>',
      fillHorizontal: 'Fill cells horizontally',
      fillVertical: 'Fill cells vertically'
    },
    buttons: {
      collection: 'Collection <span class=\'ui-button-icon-primary ui-icon ui-icon-triangle-1-s\'\/>',
      colvis: 'Column Visibility',
      colvisRestore: 'Restore visibility',
      copy: 'Copy',
      copyKeys: 'Press ctrl or u2318 + C to copy the table data to your system clipboard.<br><br>To cancel, click this message or press escape.',
      copySuccess: {
        1: 'Copied 1 row to clipboard',
        _: 'Copied %d rows to clipboard'
      },
      copyTitle: 'Copy to Clipboard',
      csv: 'CSV',
      excel: 'Excel',
      pageLength: {
        '-1': 'Show all rows',
        1: 'Show 1 row',
        _: 'Show %d rows'
      },
      pdf: 'PDF',
      print: 'Print'
    },
    searchBuilder: {
      add: 'Add Condition',
      button: {
        0: 'Search Builder',
        _: 'Search Builder (%d)'
      },
      clearAll: 'Clear All',
      condition: 'Condition',
      conditions: {
        date: {
          after: 'After',
          before: 'Before',
          between: 'Between',
          empty: 'Empty',
          equals: 'Equals',
          not: 'Not',
          notBetween: 'Not Between',
          notEmpty: 'Not Empty'
        },
        number: {
          between: 'Between',
          empty: 'Empty',
          equals: 'Equals',
          gt: 'Greater Than',
          gte: 'Greater Than Equal To',
          lt: 'Less Than',
          lte: 'Less Than Equal To',
          not: 'Not',
          notBetween: 'Not Between',
          notEmpty: 'Not Empty'
        },
        string: {
          contains: 'Contains',
          empty: 'Empty',
          endsWith: 'Ends With',
          equals: 'Equals',
          not: 'Not',
          notEmpty: 'Not Empty',
          startsWith: 'Starts With'
        },
        array: {
          without: 'Without',
          notEmpty: 'Not Empty',
          not: 'Not',
          contains: 'Contains',
          empty: 'Empty',
          equals: 'Equals'
        }
      },
      data: 'Data',
      deleteTitle: 'Delete filtering rule',
      leftTitle: 'Outdent Criteria',
      logicAnd: 'And',
      logicOr: 'Or',
      rightTitle: 'Indent Criteria',
      title: {
        0: 'Search Builder',
        _: 'Search Builder (%d)'
      },
      value: 'Value'
    },
    searchPanes: {
      clearMessage: 'Clear All',
      collapse: {
        0: 'SearchPanes',
        _: 'SearchPanes (%d)'
      },
      count: '{total}',
      countFiltered: '{shown} ({total})',
      emptyPanes: 'No SearchPanes',
      loadMessage: 'Loading SearchPanes',
      title: 'Filters Active - %d'
    },
    select: {
      1: '%d row selected',
      _: '%d rows selected',
      cells: {
        1: '1 cell selected',
        _: '%d cells selected'
      },
      columns: {
        1: '1 column selected',
        _: '%d columns selected'
      }
    },
    datetime: {
      previous: 'Previous',
      next: 'Next',
      hours: 'Hour',
      minutes: 'Minute',
      seconds: 'Second',
      unknown: '-',
      amPm: [
        'am',
        'pm'
      ]
    },
    editor: {
      close: 'Close',
      create: {
        button: 'New',
        title: 'Create new entry',
        submit: 'Create'
      },
      edit: {
        button: 'Edit',
        title: 'Edit Entry',
        submit: 'Update'
      },
      remove: {
        button: 'Delete',
        title: 'Delete',
        submit: 'Delete',
        confirm: {
          _: 'Are you sure you wish to delete %d rows?',
          1: 'Are you sure you wish to delete 1 row?'
        }
      },
      error: {
        system: 'A system error has occurred (<a target="\\" rel="nofollow" href="\\">More information<\/a>).'
      },
      multi: {
        title: 'Multiple Values',
        info: 'The selected items contain different values for this input. To edit and set all items for this input to the same value, click or tap here, otherwise they will retain their individual values.',
        restore: 'Undo Changes',
        noMulti: 'This input can be edited individually, but not part of a group. '
      }
    }
  },
  fr: {
    emptyTable: 'Aucune donnée disponible dans le tableau',
    lengthMenu: 'Afficher _MENU_ éléments',
    loadingRecords: 'Chargement...',
    processing: 'Traitement...',
    zeroRecords: 'Aucun élément correspondant trouvé',
    paginate: {
      first: 'Premier',
      last: 'Dernier',
      next: 'Suivant',
      previous: 'Précédent'
    },
    aria: {
      sortAscending: ': activer pour trier la colonne par ordre croissant',
      sortDescending: ': activer pour trier la colonne par ordre décroissant'
    },
    select: {
      rows: {
        _: '%d lignes sélectionnées',
        0: 'Aucune ligne sélectionnée',
        1: '1 ligne sélectionnée'
      },
      1: '1 ligne selectionnée',
      _: '%d lignes selectionnées',
      cells: {
        1: '1 cellule sélectionnée',
        _: '%d cellules sélectionnées'
      },
      columns: {
        1: '1 colonne sélectionnée',
        _: '%d colonnes sélectionnées'
      }
    },
    autoFill: {
      cancel: 'Annuler',
      fill: 'Remplir toutes les cellules avec <i>%d<\/i>',
      fillHorizontal: 'Remplir les cellules horizontalement',
      fillVertical: 'Remplir les cellules verticalement',
      info: 'Exemple de remplissage automatique'
    },
    searchBuilder: {
      conditions: {
        date: {
          after: 'Après le',
          before: 'Avant le',
          between: 'Entre',
          empty: 'Vide',
          equals: 'Egal à',
          not: 'Différent de',
          notBetween: 'Pas entre',
          notEmpty: 'Non vide'
        },
        number: {
          between: 'Entre',
          empty: 'Vide',
          equals: 'Egal à',
          gt: 'Supérieur à',
          gte: 'Supérieur ou égal à',
          lt: 'Inférieur à',
          lte: 'Inférieur ou égal à',
          not: 'Différent de',
          notBetween: 'Pas entre',
          notEmpty: 'Non vide'
        },
        string: {
          contains: 'Contient',
          empty: 'Vide',
          endsWith: 'Se termine par',
          equals: 'Egal à',
          not: 'Différent de',
          notEmpty: 'Non vide',
          startsWith: 'Commence par'
        },
        array: {
          equals: 'Egal à',
          empty: 'Vide',
          contains: 'Contient',
          not: 'Différent de',
          notEmpty: 'Non vide',
          without: 'Sans'
        }
      },
      add: 'Ajouter une condition',
      button: {
        0: 'Recherche avancée',
        _: 'Recherche avancée (%d)'
      },
      clearAll: 'Effacer tout',
      condition: 'Condition',
      data: 'Donnée',
      deleteTitle: 'Supprimer la règle de filtrage',
      logicAnd: 'Et',
      logicOr: 'Ou',
      title: {
        0: 'Recherche avancée',
        _: 'Recherche avancée (%d)'
      },
      value: 'Valeur'
    },
    searchPanes: {
      clearMessage: 'Effacer tout',
      count: '{total}',
      title: 'Filtres actifs - %d',
      collapse: {
        0: 'Volet de recherche',
        _: 'Volet de recherche (%d)'
      },
      countFiltered: '{shown} ({total})',
      emptyPanes: 'Pas de volet de recherche',
      loadMessage: 'Chargement du volet de recherche...'
    },
    buttons: {
      copyKeys: 'Appuyer sur ctrl ou u2318 + C pour copier les données du tableau dans votre presse-papier.',
      collection: 'Collection',
      colvis: 'Visibilité colonnes',
      colvisRestore: 'Rétablir visibilité',
      copy: 'Copier',
      copySuccess: {
        1: '1 ligne copiée dans le presse-papier',
        _: '%ds lignes copiées dans le presse-papier'
      },
      copyTitle: 'Copier dans le presse-papier',
      csv: 'CSV',
      excel: 'Excel',
      pageLength: {
        '-1': 'Afficher toutes les lignes',
        1: 'Afficher 1 ligne',
        _: 'Afficher %d lignes'
      },
      pdf: 'PDF',
      print: 'Imprimer'
    },
    decimal: ',',
    info: 'Affichage de _START_ à _END_ sur _TOTAL_ éléments',
    infoEmpty: 'Affichage de 0 à 0 sur 0 éléments',
    infoFiltered: '(filtrés de _MAX_ éléments au total)',
    infoThousands: '.',
    search: 'Rechercher:',
    searchPlaceholder: '...',
    thousands: '.',
    datetime: {
      previous: 'précédent',
      next: 'suivant',
      hours: 'heures',
      minutes: 'minutes',
      seconds: 'secondes'
    }
  }
  };
}
