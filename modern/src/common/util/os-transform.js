/* eslint-disable no-underscore-dangle */

import proj4 from 'proj4';

// defines the EPSG:27700 conversion from lat lng
proj4.defs('EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs');

export const osTransform = {
  // Bounds object (projected and geographic coordinates) for extent of GB.
  _maxBounds: {
    projected: [[0.0, 0.0], [699999.9, 1299999.9]],
    geographic: [[-8.74, 49.84], [1.96, 60.9]],
  },

  /**
   * Test whether coordinates are within the permitted bounds.
   * @param {object} coordinates - The easting + northing or latlng to be validated.
   */
  _checkBounds(coordinates) {
    let isValid = true;
    if (coordinates.hasOwnProperty('ea') && coordinates.hasOwnProperty('no')) {
      if ((coordinates.ea < this._maxBounds.projected[0][0] || coordinates.ea > this._maxBounds.projected[1][0])
        || (coordinates.no < this._maxBounds.projected[0][1] || coordinates.no > this._maxBounds.projected[1][1])) {
        isValid = false;
      }
    } else if (coordinates.hasOwnProperty('lat') && coordinates.hasOwnProperty('lng')) {
      if ((coordinates.lng < this._maxBounds.geographic[0][0] || coordinates.lng > this._maxBounds.geographic[1][0])
        || (coordinates.lat < this._maxBounds.geographic[0][1] || coordinates.lat > this._maxBounds.geographic[1][1])) {
        isValid = false;
      }
    }

    const message = isValid ? '' : 'Coordinates out of range.';

    return { valid: isValid, message };
  },

  /**
   * Test whether a standard grid reference with a valid format has been provided.
   * param {string} gridref - The grid reference to be validated.
   */
  _validateGridRef(gridref) {
    const regex = /^[THJONS][VWXYZQRSTULMNOPFGHJKABCDE] ?[0-9]{1,5} ?[0-9]{1,5}$/;
    const match = !!Array.isArray(gridref.toUpperCase().match(regex));

    const isValid = !!((gridref.replaceAll(' ', '').length % 2 === 0) && match);
    const message = isValid ? '' : 'Invalid grid reference.';

    return { valid: isValid, message };
  },

  /**
   * Return latlng from an input easting + northing.
   * @param {object} coordinates - The easting + northing to be transformed.
   * @param {integer} decimals - [optional] The specified number of decimal places.
   */
  toLatLng(coordinates, decimals = 7) {
    const test = this._checkBounds(coordinates)
    if (!test.valid) {
      console.log(test.message);
      return {};
    }

    const point = proj4('EPSG:27700', 'EPSG:4326', [coordinates.ea, coordinates.no]);

    const lng = Number(point[0].toFixed(decimals));
    const lat = Number(point[1].toFixed(decimals));

    return { lat, lng };
  },

  /**
   * Return easting + northing from an input latlng.
   * @param {object} coordinates - The latlng to be transformed.
   * @param {integer} decimals - [optional] The specified number of decimal places.
   */
  fromLatLng(coordinates, decimals = 2) {
    const test = this._checkBounds(coordinates)
    if (!test.valid) {
      console.log(test.message);
      return {};
    }

    const point = proj4('EPSG:4326', 'EPSG:27700', [coordinates.lng, coordinates.lat]);

    const e = Number(point[0].toFixed(decimals));
    const n = Number(point[1].toFixed(decimals));

    return { ea: e, no: n };
  },

  /**
   * Return grid reference [plain | encoded | components] from an input easting + northing.
   * @param {object} coordinates - The easting + northing to be converted.
   */
  toGridRef(coordinates) {
    const test = this._checkBounds(coordinates)
    if (!test.valid) {
      console.log(test.message);
      return {};
    }

    const prefixes = [
      ['SV', 'SW', 'SX', 'SY', 'SZ', 'TV', 'TW'],
      ['SQ', 'SR', 'SS', 'ST', 'SU', 'TQ', 'TR'],
      ['SL', 'SM', 'SN', 'SO', 'SP', 'TL', 'TM'],
      ['SF', 'SG', 'SH', 'SJ', 'SK', 'TF', 'TG'],
      ['SA', 'SB', 'SC', 'SD', 'SE', 'TA', 'TB'],
      ['NV', 'NW', 'NX', 'NY', 'NZ', 'OV', 'OW'],
      ['NQ', 'NR', 'NS', 'NT', 'NU', 'OQ', 'OR'],
      ['NL', 'NM', 'NN', 'NO', 'NP', 'OL', 'OM'],
      ['NF', 'NG', 'NH', 'NJ', 'NK', 'OF', 'OG'],
      ['NA', 'NB', 'NC', 'ND', 'NE', 'OA', 'OB'],
      ['HV', 'HW', 'HX', 'HY', 'HZ', 'JV', 'JW'],
      ['HQ', 'HR', 'HS', 'HT', 'HU', 'JQ', 'JR'],
      ['HL', 'HM', 'HN', 'HO', 'HP', 'JL', 'JM'],
    ];

    const x = Math.floor(coordinates.ea / 100000);
    const y = Math.floor(coordinates.no / 100000);

    const prefix = prefixes[y][x];

    let e = Math.floor(coordinates.ea % 100000); // Math.round(coordinates.ea % 100000);
    let n = Math.floor(coordinates.no % 100000); // Math.round(coordinates.no % 100000);

    e = String(e).padStart(5, '0');
    n = String(n).padStart(5, '0');

    const text = `${prefix} ${e} ${n}`;
    const html = `${prefix}&thinsp;${e}&thinsp;${n}`;

    return { text, html, letters: prefix, eastings: e, northings: n };
  },

  /**
   * Return easting + northing from an input grid reference.
   * @param {string} gridref - The grid reference to be converted.
   */
  fromGridRef(gridref) {
    gridref = String(gridref).trim();

    const test = this._validateGridRef(gridref)
    if (!test.valid) {
      console.log(test.message);
      return {};
    }

    const gridLetters = 'VWXYZQRSTULMNOPFGHJKABCDE';

    const ref = gridref.toUpperCase().replaceAll(' ', '');

    const majorEasting = gridLetters.indexOf(ref[0]) % 5 * 500000 - 1000000;
    const majorNorthing = Math.floor(gridLetters.indexOf(ref[0]) / 5) * 500000 - 500000;

    const minorEasting = gridLetters.indexOf(ref[1]) % 5 * 100000;
    const minorNorthing = Math.floor(gridLetters.indexOf(ref[1]) / 5) * 100000;

    const i = (ref.length - 2) / 2;
    const m = 10 ** (5 - i);

    const e = majorEasting + minorEasting + (ref.substr(2, i) * m);
    const n = majorNorthing + minorNorthing + (ref.substr(i + 2, i) * m);

    return { ea: e, no: n };
  },
};
