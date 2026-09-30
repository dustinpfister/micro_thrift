# micro_thrift change log

## R6 () - donor object type, donations worker role
* (pending) - donor object type stated
* (pending) - donations worker role started

## R5 () - Staff state
* (pending) - can use Staff state to hire and fire
* (pending) - can use Staff state to set hours and schedule
* (pending) - workers then spawn by way of game time system and set schedule 
* (pending) - can set primary role when working out schedule

## R4 () - worker roles, cashier
* (pending) - a worker can have a role \( stock, cashier \) 
* (pending) - have a cashout tile 
* (pending) - customers can now only buy an item at a cashout tile that is active by a worker
* (pending) - a worker will change roles based on need

## R3 () - Game Time System
* (pending) - start a game time system
* (pending) - have customers spawn by way of game time system

## R2 () - Customer AI buying choice and spawn locations
* (pending) - customers will spawn at fixed location at top of map
* (pending) - customer AI : choice of buying an item or not based on personal pref set on spawn
* (pending) - customers will leave map after making buying an item, or after a timeout

## R1 () - Button Class, menu, save manager, and options states
* (pending) - start a button class
* (pending) - start a menu state
* (pending) - start a save manager state
* (pending) - Simg assets for menu, and save manager states
* (pending) - start an options state with quit to menu, and continue options
* (pending) - simple tile edit menu in floor state using buttons
* (pending) - editing the map should cost money

## R0 () - Very basic core idea of the game started
* starting out with the code that I worked out at jsFiddle
* going with 16px assets, with a 16 by 16 map, and 640 by 480 screen res
* new SImg asset for customers and workers
* favicon
* started a config object to store various constants used in the codebase
* have both 'worker' and 'customer' types
* started an item and price option database
* started a main AI object for scripts that effect worker and customer actions
* have a map.get\_border\_tiles method with include\_types option
* have 'worker' type objects stock items
* have 'customer' type objects buy items
* have screen centered and scaled using css
* common AI.move method for all object types
* common AI.target\_task method to find, create path to, and run custom logic when it range of a target tile
* worker AI: very basic probability system for item generation
* (pending) - display %full in floor state


