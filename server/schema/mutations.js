const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID } = graphql;
const mongoose = require("mongoose");
const AuthService = require("../services/auth");
const UserType = require("./types/user_type");

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    register: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.register(args);
      }
    },
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.login(args);
      }
    },
    logout: {
      type: UserType,
      args: {
        _id: { type: GraphQLID }
      },
      resolve(_, args) {
        return AuthService.logout(args);
      }
    },
    verifyUser: {
      type: UserType,
      args: {
        token: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.verifyUser(args);
      }
    }
  }
});

// async function to use for prtective routes without spoofing.

// async resolve(_, { name, description, weight }, ctx) {
//     const validUser = await AuthService.verifyUser({token: ctx.token});

//     // if our service returns true then our product is good to save!
//     // anything else and we'll throw an error
//     if (validUser.loggedIn) {
//         return new Product({ name, description, weight }).save();
//     } else {
//         throw new Error('Sorry, you need to be logged in to create a product.');
//     }
// }


// full mutation:
// newProduct: {
//       type: ProductType,
//       args: {
//         name: { type: GraphQLString },
//         description: { type: new GraphQLNonNull(GraphQLString) },
//         weight: { type: GraphQLInt },
//         category: { type: GraphQLID }
//       },
//       async resolve(_, { name, description, weight }, ctx) {
//         const validUser = await AuthService.verifyUser({ token: ctx.token });

//         // if our service returns true then our product is good to save!
//         // anything else and we'll throw an error
//         if (validUser.loggedIn) {
//           return new Product({ name, description, weight }).save();
//         } else {
//           throw new Error('Sorry, you need to be logged in to create a product.');
//         }
//       }
//     },

module.exports = mutation;