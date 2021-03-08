import { Meteor } from "meteor/meteor";
import { UsertokensCollection } from "/imports/api/usertokens";
import { check } from "meteor/check";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { OrdersCollection } from "/imports/api/orders";

import "./apollo-server";
import { Email } from "meteor/email";
import { validateEmail } from "/imports/common";

// Meteor.startup(() => {
//   // If the Links collection is empty, add some data.
//   if (LinksCollection.find().count() === 0) {
//     insertLink(
//       "Do the Tutorial",
//       "https://www.meteor.com/tutorials/react/creating-an-app"
//     );

//     insertLink("Follow the Guide", "http://guide.meteor.com");

//     insertLink("Read the Docs", "https://docs.meteor.com");

//     insertLink("Discussions", "https://forums.meteor.com");
//   }
// });

Meteor.methods({
  requestTokenWithEmail(email) {
    check(email, String);


    const isValidEmail = validateEmail(email);

    if (!isValidEmail) {
      throw new Meteor.Error("notAValidEmail", "You did not provide a valid email:"+email);
    }

    console.log("Juhu", email);

    let ut = UsertokensCollection.findOne({ email });

    if (!ut) {
      const token = uniqueNamesGenerator({
        dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
        separator: "-",
        length: 3,
      });
      const utId = UsertokensCollection.insert({
        email,
        token,
        createdAt: new Date(),
      });
      ut = UsertokensCollection.findOne({ _id: utId });
    }

    const to = email;

    const from = "cafe@vilango.com";
    const subject = "Welcome to the GraphQL Cafe - powered by OWL!";

    const url = Meteor.absoluteUrl("/graphql");
    const text = `Hi 👋,

here is your usertoken: 
${ut?.token}

Now go to ${url}
and have fun :)

Should you have any questions please feel free to reach out to us:
MLGMOpRiskEGIT@erstegroup.com

😎 👍
`;

    Email.send({ to, from, subject, text });

    return true;
  },
});

export const anonymizeEmail = (email: string): string => {
  const aEmail = email.replace(/(.{2})(.*)(?=@)/, function (gp1, gp2, gp3) {
    for (let i = 0; i < gp3.length; i++) {
      gp2 += "*";
    }
    return gp2;
  });
  console.log("anonymizeEmail", email, aEmail);
  return aEmail;
};

// Meteor.publish("recentOrders", function () {
//   return OrdersCollection.find(
//     {},
//     {
//       limit: 30,
//       sort: { createdAt: -1 },
//     }
//     );
//   });

Meteor.publish("recentOrders", function () {
  //Transform function
  var transform = function (doc) {
    doc.email = anonymizeEmail(doc.email);
    return doc;
  };

  var self = this;
  var observer = OrdersCollection.find(
    {},
    {
      limit: 30,
      sort: { createdAt: -1 },
    }
  ).observe({
    added: function (document) {
      self.added("orders", document._id, transform(document));
    },
    changed: function (newDocument, oldDocument) {
      self.changed("orders", newDocument._id, transform(newDocument));
    },
    removed: function (oldDocument) {
      self.removed("orders", oldDocument._id);
    },
  });

  self.onStop(function () {
    observer.stop();
  });

  self.ready();
});
