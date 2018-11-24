(function(){
 
    function removeAccents ( data ) {
        return data
            .replace( /έ/g, 'ε' )
            .replace( /[ύϋΰ]/g, 'υ' )
            .replace( /ό/g, 'ο' )
            .replace( /ώ/g, 'ω' )
            .replace( /ά/g, 'α' )
            .replace( /[ίϊΐ]/g, 'ι' )
            .replace( /ή/g, 'η' )
            .replace( /\n/g, ' ' )
            .replace( /á/g, 'a' )
            .replace( /é/g, 'e' )
            .replace( /í/g, 'i' )
            .replace( /ó/g, 'o' )
            .replace( /ú/g, 'u' )
            .replace( /ê/g, 'e' )
            .replace( /î/g, 'i' )
            .replace( /ô/g, 'o' )
            .replace( /è/g, 'e' )
            .replace( /ï/g, 'i' )
            .replace( /[üúÚ]/g, 'u' )
            .replace( /ã/g, 'a' )
            .replace( /õ/g, 'o' )
            .replace( /ç/g, 'c' )
            .replace( /ì/g, 'i' );
    }
     
    var searchType = jQuery.fn.DataTable.ext.type.search;
     
    searchType.string = function ( data ) {
        return ! data ?
            '' :
            typeof data === 'string' ?
                removeAccents( data ) :
                data;
    };
     
    searchType.html = function ( data ) {
        return ! data ?
            '' :
            typeof data === 'string' ?
                removeAccents( data.replace( /<.*?>/g, '' ) ) :
                data;
    };
     
    }());
