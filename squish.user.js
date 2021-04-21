// ==UserScript==
// @name         At-a-glance GYR Hub client layout
// @namespace    http://getyourrefund.org/
// @version      0.1
// @description  Rearrange the clients table to show more important info first.
// @match        https://*.getyourrefund.org/en/hub
// @match        https://*.getyourrefund.org/en/hub/clients
// @match        https://*.getyourrefund.org/en/hub/clients?*
// @match        https://*.getyourrefund.org/en/hub/clients/sla-breaches?*
// @match        https://*.getyourrefund.org/en/hub/clients/sla-breaches
// ==/UserScript==

// // <script data-main="scripts/app" src="scripts/require.js"></script>
// let require_script = document.createElement('script');
// require_script.src = 'scripts/require.js';
// document.body.appendChild( require_script );
// let moment_script = document.createElement('<script src="moment.js"></script>');
// let days_script = document.createElement('<script src="moment-business-days.js"></script>');

// let business_days = require('moment-business-days');

var squish = function () {

  // // Prevent stuff from being added multiple times (implement after development)
  // if ( document.querySelector('.org_subtitle')  ) { return; }

  // // Be able to turn dates into business days
  // let moment_script = document.createElement('script');
  // moment_script.src = 'moment.js';
  // document.body.appendChild( moment_script );
  // let days_script = document.createElement('script');
  // days_script.src = 'moment-business-days.js';
  // document.body.appendChild( days_script );

  // let diff = moment('Mar 12 2:13 AM', 'MMMM DD LT').businessDiff(moment());
  // console.log( diff );

  // Turning the dates into business days
  // IMPORTANT: Only works for client dates in the same year as today
  let today = new Date();
  let this_year = today.getFullYear();
  let one_day_ms = 1000 * 60 * 60 * 24;

  let column_headers = document.querySelectorAll('table.client-table thead th');
  let name_header_index = 1;
  let id_index = 2;
  let org_header_index = 3;
  let updated_index = 6;
  let waiting_index = 7;
  let created_index = 8;
  for ( let header_i = 0; header_i < column_headers.length; header_i++ ) {
    let text = column_headers[ header_i ].innerText;
    if ( text === 'Name' ) { name_header_index = header_i; }
    if ( text === 'Client ID' ) { id_index = header_i; }
    if ( text === 'Organization' ) { org_header_index = header_i; }
    if ( text === 'Updated At' ) {
      updated_index = header_i;
      column_headers[ header_i ].querySelector('span').innerHTML = 'Volunteer<br>Message';
    }
    if ( text === 'Waiting on response' ) {
      waiting_index = header_i;
      column_headers[ header_i ].querySelector('span').innerHTML = 'Filer<br>Response';
    }
    if ( text === 'Created at' ) {
      created_index = header_i;
      column_headers[ header_i ].querySelector('span').innerHTML = 'Created';
    }
  }

  let all_rows_data = [];

  let info_rows = document.querySelectorAll('table.client-table tbody tr');
  for ( let row of info_rows ) {

    let cols = row.querySelectorAll(':scope > *');

    let client_id = cols[ id_index ].innerText;
    let id_container = document.createElement('span');
    id_container.class = 'name_id_info';
    id_container.innerHTML = `(${ client_id })`

    let org_name = cols[ org_header_index ].innerText;

    let name_subtitle_container = document.createElement('div');
    name_subtitle_container.innerHTML = `<span class="bookmarklet_org_subtitle">${ org_name }</span>`;
    
    let name_cell = cols[ name_header_index ];
    let name_node = name_cell.querySelectorAll( 'a' )[0];
    name_node.appendChild( id_container );
    name_cell.appendChild( name_subtitle_container );

    // Get dates in different columns
    let updated_days = '-';
    let waiting_days = '-';
    let created_days = '-';

    let updated_text = cols[ updated_index ].innerText;
    let waiting_text = cols[ waiting_index ].innerText;
    let created_text = cols[ created_index ].innerText;

    if ( updated_text ) {
      let date = new Date( updated_text + ` ${this_year}` );
      updated_days = Math.round(( today - date) / one_day_ms);
    }
    if ( waiting_text ) {
      let date = new Date( waiting_text + ` ${this_year}` );
      waiting_days = Math.round(( today - date) / one_day_ms);
    }
    if ( created_text ) {
      let date = new Date( created_text + ` ${this_year}` );
      created_days = Math.round(( today - date) / one_day_ms);
    }

    let updated_cell = cols[ updated_index ];
    let waiting_cell = cols[ waiting_index ];
    let created_cell = cols[ created_index ];

    updated_cell.innerHTML = updated_days + ' days';
    waiting_cell.innerHTML = waiting_days + ' days';
    created_cell.innerHTML = created_days + ' days';

    updated_cell.title = updated_text;
    waiting_cell.title = waiting_text;
    created_cell.title = created_text;
  

    // // Show some status items closer to the name column
    // let per_year = row.querySelectorAll('.tax-return-list li');
    // let years_data = [];
    // let years_cell = document.createElement('td');
    // let years_list = document.createElement('ul');
    // years_cell.appendChild( years_list );
    // for ( let year_row of per_year ) {
    //   let item = document.createElement('li');
    //   let year_text = year_row.querySelector( '.tax-return-list__year' ).innerText;
    //   let assignee = year_row.querySelector( '.tax-return-list__assignee' );
    //   let status = year_row.querySelector( '.tax-return-list__status' );
    //   item.innerHTML = `<span class="bookmarklet_tax_year">${ year_text }</span>`;
    //   item.appendChild( assignee );
    //   item.appendChild( status );
    //   years_data.push({ item, year: year_text, assignee, status });
    // }


    // // Alternative data structure. Thoughts for refactoring.
    // let row_data = {
    //   row,
    //   id: id_container,
    //   org: name_subtitle_container,
    //   // years: years_data,
    //   // years_cell: years_cell,
    // }
    // all_rows_data.push( row_data );

  }

  let all_rows = document.querySelectorAll('table.client-table tr');
  for ( let row of all_rows ) {
    // Move columns out of view
    let cols = row.querySelectorAll(':scope > *');
    let id_cell = cols[ id_index ];
    let org_cell = cols[ org_header_index ];
    row.appendChild( id_cell );
    row.appendChild( org_cell );

    // // Add new column for status data
    // let new_status_col = document.createElement('td');
    // new_status_col.className = 'bookmarklet_status_col';
    // let name_cell = cols[ name_header_index ];
    // name_cell.parentNode.insertBefore( new_status_col, name_cell.nextSibling );
  }




  var css = document.createElement('style');
  css.innerHTML = `
td.index-table__cell,
th.index-table__header,
.index-table__row-header {
padding: 0 0.5em;
}
.tax-return-list__assignment {
min-height: unset;
}
.bookmarklet_org_subtitle {
  font-weight: 400;
}
  `;
  document.getElementsByTagName('head')[0].appendChild(css);

};  // Ends squish()


try {
  squish();
} catch ( err ) {
  console.log( '"At-a-glance" bookmarklet ran into an error.' );
  console.error( err );
}
