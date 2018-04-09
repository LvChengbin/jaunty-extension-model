function getDataByPath( src, path ) {
    return new Function( 's', 'try{with(s)return ' + path + '}catch(e){window.console.warn("[J WARN] getDataByPath : " + e)}' )( src );
}

export { getDataByPath };
