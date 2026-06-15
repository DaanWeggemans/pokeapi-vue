export function map_pokemons(data) {
    return data.results.map(pokemon => {
        const parts = pokemon.url.split('/').filter(x => x.length > 0);
        const index = Number(parts[parts.length - 1]);

        return {
            id: index,
            name: pokemon.name.replaceAll('-', ' '),
            url: pokemon.url,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index}.png`
        };
    });
}

export function map_details(data) {
    return {
        abilities: data.abilities.map(ability => {
            return {
                name: ability.ability.name.replace(/[- ].|^./g, letter => letter.replaceAll("-", " ").toUpperCase()),
                isHidden: ability.is_hidden
            };
        }),
        stats: data.stats.map(stat => {
            return {
                base: stat.base_stat,
                name: stat.stat.name
            };
        }),
        types: data.types.map(type => {
            const parts = type.type.url.split('/').filter(x => x.length > 0);
            const index = Number(parts[parts.length - 1]);

            return {
                name: type.type.name,
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/brilliant-diamond-shining-pearl/${index}.png`
            };
        })
    };
}

export function map_evolution(evolution) {
    if (!evolution || (Array.isArray(evolution) && !evolution.length))
        return [];

    const evolves_to = Array.isArray(evolution) ? evolution : [evolution];

    const evolves_to_item = evolves_to.map(x => {
        const parts = x.species.url.split('/').filter(x => x);
        const index = Number(parts[parts.length - 1]);

        return {
            id: index,
            name: x.species.name.replaceAll('-', ' '),
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index}.png`
        };
    });

    const next_evolves_to = evolves_to.flatMap(node => node.evolves_to || []);
    return [evolves_to_item, ...map_evolution(next_evolves_to)];
}