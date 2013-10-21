iD.actions.ChangeTags = function(entityId, tags) {
    return function(graph) {
        var entity = graph.entity(entityId);
        return graph.replace(entity.update({tags: tags}));
    };
};
