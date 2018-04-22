// function to generate dummy data for the "Brands" database.
// ----------------------------------------------------------
#include <stdio.h>
#include <math.h>
#include <time.h>
#include <stdlib.h>

void main(void) {

  FILE *fp;
  fp                     = fopen("data.csv", "w");
  char header[255]       = "brand, price, waist, thigh, inseam, outseam, leg_open, rise, hip, web_link, id"; 
  char printstr[255]     = "%s, %3.2f, %3.2f, %3.2f, %3.2f, %3.2f, %3.2f, %3.2f, %3.2f, %s, %d; \n";
  char brands[11][32]    = {"express", "zara", "banana republic",
			    "guess", "7 for all mankind", "levis",
			    "diesel", "rag and bone", "wrangler",
			    "true religion", "calvin klein"};
  char web_link[11][255] = {"www.express.com", "www.zara.com", "www.bananarepublic.com",
                            "www.guess.com", "www.7forallmankind.com", "www.levis.com",
                            "www.diesel.com", "www.ragandbone.com", "www.wrangler.com",
                            "www.truereligion.com", "www.calvinklein.com"};
  
  
  int   brand_idx;           
  float M          = (float)RAND_MAX;
  int   kk;
  float waist      = 32;
  float hip        = 34;
  float thigh      = 15;
  float leg_open   = 10;
  float inseam     = 32;
  float outseam    = 36;
  float rise       = 8;
  
  float var_waist     = 10;
  float var_hip       = 10;
  float var_thigh     = 5;
  float var_leg_open  = 2;
  float var_inseam    = 10;
  float var_outseam   = 10;
  float var_rise      = 3;
  srand((unsigned int)time(NULL));
  // writing the header.
  fprintf(fp, "%s;\n", header);
  for( kk = 0; kk < 256; kk++) {
    brand_idx = (int)(rand()/M*11);
    fprintf( fp, printstr, brands[brand_idx],
	     rand()/M*400,
	     waist + (rand()/M-0.5)*var_waist,
	     thigh + (rand()/M-0.5)*var_thigh,
             inseam + (rand()/M-0.5)*var_inseam,
             outseam + (rand()/M-0.5)*var_outseam,	     
             leg_open + (rand()/M-0.5)*var_leg_open,
             rise + (rand()/M-0.5)*var_rise,	     
	     hip + (rand()/M-0.5)*var_hip,
             web_link[brand_idx],
	     kk+1);	     
  }
  
  fclose(fp);

} 
