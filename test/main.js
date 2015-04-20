
var app = require('../server/server');

describe('Top', function() {

   this.timeout(1000);
   var Comments = app.models.Comment;
   var MyModel = app.models.MyModel;
   var OtherModel = app.models.OtherModel;

   before( function(done) {

      MyModel.create({myId: 1}, function(err, res) {
         if(err) console.log(err);
         Comments.create({
            id: 1,
            commentableId: 1,
            commentableType: 'myModel'
         } , function(err, res) {
            if(err) console.log(err);
            OtherModel.create(
            function(err, res) {
               if(err) console.log(err);
               Comments.create({
                  id: 2,
                  commentableId: res.id,
                  commentableType: 'otherModel'
               }, function(err, res) {
                  if(err) console.log(err);
                  done();
               });
            });
         });
      });

   });

   describe('Get myModel with its comments', function() {
      it('Should get a myModel and all of its comments', function(done) {

         MyModel.find({
            include: {
               relation: 'comments'
            }
         },
         function(err, res) {
            if(res[0].__cachedRelations.comments) {
               done();
            }
            else {
               console.log(res);
               console.log(res[0].__cachedRelations.comments);
               done('Error: ' + res.comments);
            }
         });
      });
   });

   describe('Get comment including otherModel', function() {
      it('Should get a comment and otherModel', function(done) {

         Comments.find({
            where: {
               id: 2,
            },
            include: {
               relation: 'commentable'
            }
         },
         function(err, res) {
            if(res[0].__cachedRelations.commentable) {
               done();
            }
            else {
               console.log(res);
               console.log(res[0].__cachedRelations.commentable);
               done('Error: no related model included');
            }
         });
      });
   });

   describe('Get comment including myModel', function() {
      it('Should get a comment and myModel', function(done) {

         Comments.find({
            where: {
               id: 1,
            },
            include: {
               relation: 'commentable'
            }
         },
         function(err, res) {
            if(res[0].__cachedRelations.commentable) {
               done();
            }
            else {
               console.log(res);
               console.log(res[0].__cachedRelations.commentable);
               done('Error: no related model included');
            }
         });
      });
   });

});

