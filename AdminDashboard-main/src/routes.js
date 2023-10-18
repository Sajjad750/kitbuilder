// KitBuilder Dashboard React layouts
import Dashboard from "layouts/dashboard";
// import Tables from "layouts/tables";
// import RTL from "layouts/rtl";
import Profile from "layouts/profile";
import Icon from "@mui/material/Icon";
import ProductLoader from "examples/ProductsLoader/ProductsLoader";
import AddProduct from "layouts/addProducts/addproducts";
import AddCategory from "layouts/addCategories/addcategories";
import FileSection from "layouts/filesSection/FilesSection";

import CategoriesLoader from "examples/categoriesLoader/categoriesLoader";
import QuotesLoader from "examples/quotesLoader/quotesLoader";
import Retailers from "layouts/retailers";
import { Newsletter } from "layouts/newsletter/Newsletter";
import QuoteDetails from "layouts/quotes/quotesDetails/QuoteDetails";
import IssueTickets from "layouts/tickets/IssueTickets/IssueTickets";
import Tickets from "layouts/tickets/Tickets/Tickets";
import TicketsDetails from "layouts/tickets/TicketsDetails/TicketsDetails";
import UpdateTicket from "layouts/tickets/TicketUpdate/TicketUpdate";
import RetailerDetails from "layouts/retailers/retailerDetails/retailerDetails";
import RetailerForm from "layouts/addRetailer/addRetailer";
import CsvUploadComponent from "layouts/bulkImport/bulkImport";


export const RetailerRoutesObject = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />
  },
  {
    type: "collapse",
    name: "Quotes Data",
    key: "quotes",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/quotes",
    component: <QuotesLoader />
  },  {
    type: "collapse",
    name: "Quotes Details",
    key: "quotesdetails",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/quotesdetails",
    component: <QuoteDetails />
  },
  {
    type: "collapse",
    name: "Products",
    key: "products",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/products",
    component: <ProductLoader />
  }, 
   {
    type: "collapse",
    name: "Add Products",
    key: "addproducts",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/addproducts",
    component: <AddProduct />
  },
  {
    type: "collapse",
    name: "Add Categories",
    key: "addcategories",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/addcategories",
    component: <AddCategory />
  },
  {
    type: "collapse",
    name: "Categories",
    key: "categories",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/categories",
    component: <CategoriesLoader />
  }
]

export const AdminroutesObject = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />
  },
  {
    type: "collapse",
    name: "Retailers",
    key: "retailers",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/retailers",
    component: <Retailers />
  },
  {
    type: "collapse",
    name: "Add Retailers",
    key: "addretailers",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/addretailers",
    component: <RetailerForm />
  },
  {
    type: "collapse",
    name: "Products",
    key: "products",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/products",
    component: <ProductLoader />
  }, 
   {
    type: "collapse",
    name: "Add Products",
    key: "addproducts",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/addproducts",
    component: <AddProduct />
  },
  {
    type: "collapse",
    name: "Add Categories",
    key: "addcategories",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/addcategories",
    component: <AddCategory />
  },
  {
    type: "collapse",
    name: "Categories",
    key: "categories",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/categories",
    component: <CategoriesLoader />
  },    
  {
    type: "collapse",
    name: "Filesection",
    key: "filessection",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/filesection",
    component: <FileSection />
  },  
  {
    type: "collapse",
    name: "Quotes Data",
    key: "quotes",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/quotes",
    component: <QuotesLoader />
  },
  {
    type: "collapse",
    name: "Newsletter",
    key: "newsletter",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/newsletter",
    component: <Newsletter />
  },  {
    type: "collapse",
    name: "Quotes Details",
    key: "quotesdetails",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/quotesdetails",
    component: <QuoteDetails />
  },{
    type: "collapse",
    name: "Issue Tickets",
    key: "issuetickets",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/issuetickets",
    component: <IssueTickets />
  },
  {
    type: "collapse",
    name: "Tickets",
    key: "tickets",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/tickets",
    component: <Tickets />
  },  {
    type: "collapse",
    name: "Tickets Details",
    key: "ticketsdetails",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/ticketsdetails",
    component: <TicketsDetails />
  },{
    type: "collapse",
    name: "Tickets Update",
    key: "ticketupdate",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/ticketupdate",
    component: <UpdateTicket />
  } ,  {
    type: "collapse",
    name: "Retailer Details",
    key: "retailerdetails",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/retailerdetails",
    component: <RetailerDetails />
  } 
  ,  {
    type: "collapse",
    name: "Bulk CSV Import",
    key: "csvupload",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/bulkimport",
    component: <CsvUploadComponent />
  } 
];



// export default routesObject;


  // {
  //   type: "collapse",
  //   name: "Billing",
  //   key: "billing",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/billing",
  //   component: <Billing />,
  // }
  
  // {
  //   type: "collapse",
  //   name: "RTL",
  //   key: "rtl",
  //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //   route: "/rtl",
  //   component: <RTL />,
  // },
  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },

  // ,{
  //   type: "collapse",
  //   name: "Sign In",
  //   key: "sign-in",
  //   icon: <Icon fontSize="small">login</Icon>,
  //   route: "/authentication/sign-in",
  //   component: <SignIn />,
  // },
  // {
  //   type: "collapse",
  //   name: "Sign Up",
  //   key: "sign-up",
  //   icon: <Icon fontSize="small">assignment</Icon>,
  //   route: "/authentication/sign-up",
  //   component: <SignUp />,
  // },
