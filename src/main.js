import ShowboxAPI from './ShowboxAPI.js';
import FebboxAPI from './FebBoxApi.js';

(async () => {
    const api = new ShowboxAPI();
    const febboxApi = new FebboxAPI();

    const movieTitle = 'ratatouille';
    const results = await api.search(movieTitle , 'movie');
    const movie = results[0];
    console.log('Movie:', movie);

    let febBoxId = await api.getFebBoxId(movie.id, movie.box_type);

    if (febBoxId) {
        console.log('FebBox ID:', febBoxId);
        const files = await febboxApi.getFileList(febBoxId);
        console.log('File List:', files);
        const file = files[1];
        console.log('File:', file);
        const links = await febboxApi.getLinks(febBoxId, file.fid);
        console.log('Links:', links);
    }

    const showTitle = 'breaking bad';
    const showResults = await api.search(showTitle, 'tv');
    const show = showResults[0];
    console.log('Show:', show);
    const showId = show.id;
    const showDetails = await api.getShowDetails(showId);
    console.log('Show Details:', showDetails);
    febBoxId = await api.getFebBoxId(show.id, show.box_type);
    console.log('FebBox ID:', febBoxId);
    if (febBoxId) {
        const files = await febboxApi.getFileList(febBoxId);
        console.log('File List:', files);
        const file = files[4];
        // chechk if is_dir this means is a season folder
        if (file.is_dir) {
            console.log('File:', file.file_name);
            const seasonFiles = await febboxApi.getFileList(febBoxId, file.fid);
            console.log('Season Files:', seasonFiles);
            const seasonFile = seasonFiles[0];
            console.log('Season File:', seasonFile);
            const links = await febboxApi.getLinks(febBoxId, seasonFile.fid);
            console.log('Links:', links);

            
        } else {
            const links = await febboxApi.getLinks(febBoxId, file.fid);
            console.log('Links:', links);
        }
    }

})();
