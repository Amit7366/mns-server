// gameList.service.ts
import { GameCatalogModel } from '../../models/GameCatalogModel';

interface GameFilter {
    provider?: string;
    game_type?: string;
}

export const createGame = async (data: any) => {
    return await GameCatalogModel.create(data);
};

export const getGameById = async (id: string) => {
    return await GameCatalogModel.findById(id);
};

export const updateGame = async (id: string, data: any) => {
    return await GameCatalogModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteGame = async (id: string) => {
    return await GameCatalogModel.findByIdAndDelete(id);
};

export const getFilteredGames = async (filter: GameFilter) => {
    const query: any = {};

    if (filter.provider) {
        query.provider = filter.provider;
    }
    if (filter.game_type) {
        query.game_type = filter.game_type;
    }

    const games = await GameCatalogModel.find(query).sort({ createdAt: -1 });
    const total = await GameCatalogModel.countDocuments(query);

    return {
        meta: {
            total,
        },
        data: games,
    };
};

export const groupByProvider = async () => {
    return await GameCatalogModel.aggregate([
        {
            $group: {
                _id: '$provider',
                categories: { $addToSet: '$game_type' },
                gamesByCategory: {
                    $push: {
                        game_type: '$game_type',
                        game_code: '$game_code',
                        game_name: '$game_name',
                        game_image: '$game_image',
                        platform: '$platform'
                    }
                }
            }
        },
        {
            $project: {
                provider: '$_id',
                categories: 1,
                games: {
                    $arrayToObject: {
                        $map: {
                            input: '$categories',
                            as: 'cat',
                            in: {
                                k: '$$cat',
                                v: {
                                    $filter: {
                                        input: '$gamesByCategory',
                                        as: 'g',
                                        cond: { $eq: ['$$g.game_type', '$$cat'] }
                                    }
                                }
                            }
                        }
                    }
                },
                _id: 0
            }
        }
    ]);
};

export const groupByCategory = async () => {
    return await GameCatalogModel.aggregate([
        {
            $group: {
                _id: '$game_type',
                providers: { $addToSet: '$provider' },
                gamesByProvider: {
                    $push: {
                        provider: '$provider',
                        game_code: '$game_code',
                        game_name: '$game_name',
                        game_image: '$game_image',
                        platform: '$platform'
                    }
                }
            }
        },
        {
            $project: {
                category: '$_id',
                providers: 1,
                games: {
                    $arrayToObject: {
                        $map: {
                            input: '$providers',
                            as: 'prov',
                            in: {
                                k: '$$prov',
                                v: {
                                    $filter: {
                                        input: '$gamesByProvider',
                                        as: 'g',
                                        cond: { $eq: ['$$g.provider', '$$prov'] }
                                    }
                                }
                            }
                        }
                    }
                },
                _id: 0
            }
        }
    ]);
};
