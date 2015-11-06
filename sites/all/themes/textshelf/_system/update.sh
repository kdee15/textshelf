echo ""
echo "===================================================================="
echo "==                                                                =="
echo "==    WELCOME TO KONSTRUCT.BOILERPLATE UPDATE SCRIPT!             =="
echo "==    --------------------------------------------------------    =="
echo "==    Updating the system to be used on another pc.               =="
echo "==                                                                =="
echo "===================================================================="
echo ""

read -p "Is this an existing project that you cloned from a repository? (Y/N) " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    
    echo "== Step 1: Installing Node Modules..."
    echo ""
    echo "--------------------------------------------------------------------"
    echo ""
    sudo npm install
    
    echo "== Step 2: Installing Bower Dependencies..."
    echo ""
    echo "--------------------------------------------------------------------"
    echo ""
    bower install
    
    echo "== Step 3: Updating Konstruct..."
    echo ""
    echo "--------------------------------------------------------------------"
    echo ""
    gulp update-css
    
    echo "== Step 4: Installing Javascript Components..."
    echo ""
    echo "--------------------------------------------------------------------"
    echo ""
    gulp install-js
    
    echo "== Step 5: Preparing Javascript Components..."
    echo ""
    echo "--------------------------------------------------------------------"
    echo ""
    gulp concat-js
    
    echo ""
    echo " == THANKS FOR INSTALLING KONSTRUCT! =="
    echo ""
    
else

    echo ""
    echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    echo "XX                                                                XX"
    echo "XX    PLEASE RUN './INSTALL.SH'                                   XX"
    echo "XX    --------------------------------------------------------    XX"
    echo "XX    Please run the update.sh script instead of the install      XX"
    echo "XX    script. You will override everything you've done so far.    XX"
    echo "XX                                                                XX"
    echo "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    echo ""
    
fi

